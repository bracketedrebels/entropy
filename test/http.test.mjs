import test from 'node:test';
import assert from 'node:assert/strict';
import { get } from 'node:http';
import { setTimeout as pause } from 'node:timers/promises';
import { map, mergeMap, delay, filter, of, take } from 'rxjs';
import { createProgram } from '../dist/full-name.mjs';
import { createHost, readQuery, getPayload, makeOk, makeResponse } from '../runtime/http.mjs';

async function started(t, config) {
  const app = createProgram(config);
  t.after(() => app.stop());
  const { url } = await app.start();
  return { app, url };
}
async function eventually(predicate) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await pause(5);
  }
  assert.fail('condition did not become true');
}

test('generated program returns the agreed response and inferred contracts', async t => {
  const { app, url } = await started(t);
  const result = await fetch(`${url}?first=Dan&last=Mironenko`);
  assert.equal(result.status, 200);
  assert.match(result.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await result.json(), { full: 'Dan Mironenko' });
  assert.equal(app.signatures['fullname.prepareResponse'], '(fn ((Request JSON)) Response)');
  assert.match(app.signatures['fullname.formatName'], /first String/);
  assert.match(app.signatures['fullname.formatName'], /last String/);
  assert.match(app.signatures['fullname.formatName'], /full String/);
  await app.stop();
  assert.deepEqual(app.inspect(), { state: 'stopped', pending: 0, requestListeners: 0, error: undefined });
});

test('validation failure stays within one request, no coercion or mutation', async t => {
  const { app, url } = await started(t);
  for (const query of ['first=Dan', 'first=Dan&last=M&extra=1', 'first=Dan&first=Ann&last=M', 'first=Dan&last=M&__proto__=bad']) {
    const bad = await fetch(`${url}?${query}`);
    assert.equal(bad.status, 400, query);
    assert.equal((await bad.json()).error, 'validation');
    const good = await fetch(`${url}?first=Иван&last=Иванов`);
    assert.equal(good.status, 200);
    assert.deepEqual(await good.json(), { full: 'Иван Иванов' });
  }
  assert.equal(app.inspect().pending, 0);
});

test('parallel requests keep their own reply capabilities', async t => {
  const { url } = await started(t);
  await Promise.all(Array.from({ length: 40 }, async (_, i) => {
    const result = await fetch(`${url}?first=Person${i}&last=Family${40 - i}`);
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), { full: `Person${i} Family${40 - i}` });
  }));
});

test('endpoint configuration, unknown path and unsupported method', async t => {
  const { url } = await started(t, { path: '/custom' });
  assert.match(url, /\/custom$/);
  assert.equal((await fetch(url.replace('/custom', '/missing'))).status, 404);
  const method = await fetch(url, { method: 'POST', body: '{}' });
  assert.equal(method.status, 405);
  assert.equal(method.headers.get('allow'), 'GET');
});

test('start and stop are idempotent; each program has an isolated host', async t => {
  const a = createProgram();
  const b = createProgram();
  t.after(() => Promise.all([a.stop(), b.stop()]));
  const [one, again, two] = await Promise.all([a.start(), a.start(), b.start()]);
  assert.equal(one.port, again.port);
  assert.notEqual(one.port, two.port);
  assert.equal(a.inspect().requestListeners, 1);
  await Promise.all([a.stop(), a.stop()]);
  await assert.rejects(a.start(), /stopped/);
  assert.equal((await fetch(`${two.url}?first=A&last=B`)).status, 200);
});

test('bind failure and stop during startup remove source listeners', async t => {
  const first = await started(t);
  const occupied = createProgram({ port: Number(new URL(first.url).port) });
  t.after(() => occupied.stop());
  await assert.rejects(occupied.start(), { code: 'EADDRINUSE' });
  assert.equal(occupied.inspect().requestListeners, 0);
  const early = createProgram();
  const start = early.start();
  await early.stop();
  await start;
  assert.equal(early.inspect().state, 'stopped');
  assert.equal(early.inspect().requestListeners, 0);
});

test('out-of-order async delivery and duplicate responses never cross requests', async t => {
  const host = createHost();
  const stream = host.requests.pipe(mergeMap(req => {
    const name = getPayload(readQuery(req)).name;
    return of(makeResponse(req, makeOk({ name })), makeResponse(req, makeOk({ name: 'duplicate' })))
      .pipe(delay(name === 'slow' ? 25 : 0));
  }));
  const app = host.program(() => host.responses(stream), {});
  t.after(() => app.stop());
  const { url } = await app.start();
  const [a, b] = await Promise.all([fetch(`${url}?name=slow`), fetch(`${url}?name=fast`)]);
  assert.deepEqual(await a.json(), { name: 'slow' });
  assert.deepEqual(await b.json(), { name: 'fast' });
  assert.equal(app.inspect().pending, 0);
});

test('source sharing attaches one listener and all subscribers see one exchange', async t => {
  const host = createHost();
  const values = [];
  const app = host.program(() => {
    host.responses(host.requests.pipe(map(req => { values.push(req); return makeResponse(req, makeOk('one')); })));
    host.responses(host.requests.pipe(map(req => { values.push(req); return makeResponse(req, makeOk('two')); })));
  }, {});
  t.after(() => app.stop());
  const { url } = await app.start();
  assert.equal(app.inspect().requestListeners, 1);
  assert.equal(await (await fetch(url)).json(), 'one');
  assert.equal(values.length, 2);
  assert.equal(values[0], values[1]);
});

test('timeout and disconnect release correlation state', async t => {
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

test('completion of the last sink closes its source and platform host', async t => {
  const host = createHost();
  const app = host.program(() => host.responses(host.requests.pipe(take(1), map(req => makeResponse(req, makeOk('done'))))), {});
  t.after(() => app.stop());
  const { url } = await app.start();
  assert.equal(await (await fetch(url)).json(), 'done');
  await eventually(() => app.inspect().state === 'stopped');
  assert.equal(app.inspect().requestListeners, 0);
  assert.equal(app.inspect().pending, 0);
});

test('graph failure terminates the owned runtime without unhandled RxJS errors', async t => {
  const host = createHost();
  const app = host.program(() => host.responses(host.requests.pipe(map(() => { throw new Error('native failure'); }))), {});
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
