import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgram } from '../dist/full-name.mjs';

async function started(t, config) {
  const app = createProgram(config);
  t.after(() => app.stop());
  const { url } = await app.start();
  return { app, url };
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
