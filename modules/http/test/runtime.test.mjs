import test from 'node:test';
import assert from 'node:assert/strict';
import { get } from 'node:http';
import { setTimeout as pause } from 'node:timers/promises';
import { map, mergeMap, delay, filter, of, take } from 'rxjs';
import { createHost, readQuery, getPayload, makeOk, makeResponse } from '../runtime.mjs';

async function eventually(predicate) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await pause(5);
  }
  assert.fail('condition did not become true');
}

test('out-of-order async delivery and duplicate responses never cross requests', async (t) => {
  const host = createHost();
  const stream = host.requests.pipe(
    mergeMap((req) => {
      const name = getPayload(readQuery(req)).name;
      return of(makeResponse(req, makeOk({ name })), makeResponse(req, makeOk({ name: 'duplicate' }))).pipe(
        delay(name === 'slow' ? 25 : 0),
      );
    }),
  );
  const app = host.program(() => host.responses(stream), {});
  t.after(() => app.stop());
  const { url } = await app.start();
  const [a, b] = await Promise.all([fetch(`${url}?name=slow`), fetch(`${url}?name=fast`)]);
  assert.deepEqual(await a.json(), { name: 'slow' });
  assert.deepEqual(await b.json(), { name: 'fast' });
  assert.equal(app.inspect().pending, 0);
});

test('source sharing attaches one listener and all subscribers see one exchange', async (t) => {
  const host = createHost();
  const values = [];
  const app = host.program(() => {
    host.responses(
      host.requests.pipe(
        map((req) => {
          values.push(req);
          return makeResponse(req, makeOk('one'));
        }),
      ),
    );
    host.responses(
      host.requests.pipe(
        map((req) => {
          values.push(req);
          return makeResponse(req, makeOk('two'));
        }),
      ),
    );
  }, {});
  t.after(() => app.stop());
  const { url } = await app.start();
  assert.equal(app.inspect().requestListeners, 1);
  assert.equal(await (await fetch(url)).json(), 'one');
  assert.equal(values.length, 2);
  assert.equal(values[0], values[1]);
});

test('timeout and disconnect release correlation state', async (t) => {
  const host = createHost({ timeoutMs: 60 });
  const app = host.program(() => host.responses(host.requests.pipe(filter(() => false))), {});
  t.after(() => app.stop());
  const { url } = await app.start();
  const result = await fetch(url);
  assert.equal(result.status, 504);
  assert.equal(app.inspect().pending, 0);
  const req = get(url);
  req.on('error', () => {});
  await eventually(() => app.inspect().pending === 1);
  req.destroy();
  await eventually(() => app.inspect().pending === 0);
  await app.stop();
  assert.equal(app.inspect().requestListeners, 0);
});

test('completion of the last sink closes its source and platform host', async (t) => {
  const host = createHost();
  const app = host.program(
    () =>
      host.responses(
        host.requests.pipe(
          take(1),
          map((req) => makeResponse(req, makeOk('done'))),
        ),
      ),
    {},
  );
  t.after(() => app.stop());
  const { url } = await app.start();
  assert.equal(await (await fetch(url)).json(), 'done');
  await eventually(() => app.inspect().state === 'stopped');
  assert.equal(app.inspect().requestListeners, 0);
  assert.equal(app.inspect().pending, 0);
});

test('graph failure terminates the owned runtime without unhandled RxJS errors', async (t) => {
  const host = createHost();
  const app = host.program(
    () =>
      host.responses(
        host.requests.pipe(
          map(() => {
            throw new Error('native failure');
          }),
        ),
      ),
    {},
  );
  t.after(() => app.stop());
  const { url } = await app.start();
  const result = await fetch(url);
  assert.equal(result.status, 500);
  assert.equal((await result.json()).error, 'graph_failure');
  await app.stop();
  assert.equal(app.inspect().error, 'native failure');
  assert.equal(app.inspect().pending, 0);
  assert.equal(app.inspect().requestListeners, 0);
});
