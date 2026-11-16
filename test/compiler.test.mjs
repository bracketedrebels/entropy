import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { loadBundle, compileBundle } from '../scripts/compile.mjs';
import { encode, validator, field, tuple, map, switchMap, of } from '../runtime/stdlib.mjs';
import { lastValueFrom, toArray } from 'rxjs';

const original = await loadBundle('examples/full-name/project.json');
const bundle = () => structuredClone(original);
test('native compiler emits plain JS with no MoonBit runtime and deterministic output', () => {
  const first = compileBundle(bundle());
  assert.deepEqual(compileBundle(bundle()), first);
  assert.doesNotMatch(first.javascript, /moonbit|moonrun|\.wasm/i);
  assert.match(first.javascript, /http\.createHost/);
});

test('schema is the type authority and incompatible changes fail before execution', () => {
  const changed = bundle();
  changed.schemas['person.schema.json'].properties.first = {
    type: 'object', properties: {}, required: [], additionalProperties: false,
  };
  assert.throws(() => compileBundle(changed), /type mismatch/);
  const unsupported = bundle();
  unsupported.schemas['person.schema.json'].properties.first.minLength = 1;
  assert.throws(() => compileBundle(unsupported), /unsupported Draft 7 keyword: minLength/);
});

test('missing field, mismatched Request/Response and unknown target are errors', () => {
  const missing = bundle();
  missing.sources.at(-1).text = missing.sources.at(-1).text.replace('(field person first)', '(field person unknown)');
  assert.throws(() => compileBundle(missing), /tuple fields differ/);
  const wrong = bundle();
  wrong.sources.at(-1).text = wrong.sources.at(-1).text.replace('(output (call responses outgoing))', '(output (call responses incoming))');
  assert.throws(() => compileBundle(wrong), /type mismatch/);
  assert.throws(() => compileBundle({ ...bundle(), target: 'wasm' }), /only target=nodejs/);
});

test('native declarations and Entropy graphs can coexist in one module', () => {
  const mixed = bundle();
  mixed.sources.at(-1).text = mixed.sources.at(-1).text.replace('(module fullname', '(module fullname (native function identity (forall (a) (fn (a) a)) (nodejs core.identity))');
  const output = compileBundle(mixed);
  assert.ok(output.signatures['fullname.identity']);
  assert.ok(output.signatures['fullname.formatName']);
});

test('partial application is emitted and runs inside the HTTP graph', async t => {
  const changed = bundle();
  changed.sources.at(-1).text = changed.sources.at(-1).text.replace('(call std.join " " (vector first last))', '(call (partial std.join " ") (vector first last))');
  const file = new URL('../dist/partial-test.mjs', import.meta.url);
  t.after(() => rm(file, { force: true }));
  await writeFile(file, compileBundle(changed).javascript);
  const { createProgram } = await import(file);
  const app = createProgram();
  t.after(() => app.stop());
  const { url } = await app.start();
  assert.deepEqual(await (await fetch(`${url}?first=Dan&last=Mironenko`)).json(), { full: 'Dan Mironenko' });
});

test('schema codecs preserve nested tuple fields and reject bad data without coercion', () => {
  const schema = {
    type: 'object', properties: { person: { type: 'object', properties: { first: { type: 'string' } }, required: ['first'], additionalProperties: false } }, required: ['person'], additionalProperties: false,
  };
  const validate = validator(schema);
  const original = { person: { first: 'Dan' } };
  const valid = validate(original);
  assert.equal(valid.tag, 'ok');
  assert.equal(field(field(valid.value, 'person'), 'first'), 'Dan');
  assert.deepEqual(encode(valid.value), original);
  assert.deepEqual(original, { person: { first: 'Dan' } });
  assert.equal(validate({ person: { first: 42 } }).tag, 'error');
  assert.equal(validate({ person: { first: 'Dan', extra: true } }).tag, 'error');
  assert.deepEqual(encode(tuple(['__proto__'], ['safe'])), JSON.parse('{"__proto__":"safe"}'));
  assert.throws(() => encode(Infinity), /JSON encodable/);
});

test('stdlib operators delegate to RxJS and constants emit once', async () => {
  assert.deepEqual(await lastValueFrom(map(x => x + 1, of(1)).pipe(toArray())), [2]);
  assert.deepEqual(await lastValueFrom(switchMap(x => of(x, x), of('a')).pipe(toArray())), ['a', 'a']);
});

test('generated output records debug signatures separately from user source', async () => {
  const source = await readFile('examples/full-name/full-name.ent', 'utf8');
  assert.doesNotMatch(source, /\(native|\(type|\(forall/);
  const output = JSON.parse(await readFile('dist/full-name.mjs.types.json', 'utf8'));
  assert.equal(output['fullname.main'], '(fn () Unit)');
});
