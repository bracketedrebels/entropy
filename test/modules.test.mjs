import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadBundle, compileBundle, compileFile } from '../scripts/compile.mjs';

const root = resolve('.');
async function fixture(t) {
  await mkdir('dist', { recursive: true });
  const directory = await mkdtemp(resolve('dist/module-layout-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}
const jsonFile = (path, value) => writeFile(path, JSON.stringify(value));

test('module manifests resolve transitive dependencies once and relative to their owner', async (t) => {
  const directory = await fixture(t);
  const manifest = join(directory, 'project.json');
  await jsonFile(manifest, {
    target: 'nodejs',
    modules: [
      relative(directory, resolve('modules/http/package.json')),
      relative(directory, resolve('modules/stdlib/package.json')),
      relative(directory, resolve('examples/full-name/full-name.ent')),
    ],
    schemas: { 'person.schema.json': relative(directory, resolve('examples/full-name/person.schema.json')) },
  });
  const bundle = await loadBundle(manifest);
  assert.deepEqual(
    bundle.nativeModules.map((m) => m.generator),
    ['stdlib', 'http'],
  );
  assert.equal(bundle.sources.length, 3);
  assert.ok(bundle.sources[0].name.endsWith('modules/stdlib/module.ent'));
  assert.ok(bundle.sources[1].name.endsWith('modules/http/module.ent'));
  assert.equal(compileBundle(bundle).visualization.entry, 'fullname.main');
});

test('a relocated stdlib package compiles and runs without HTTP or former runtime directories', async (t) => {
  const directory = await fixture(t);
  const packageDirectory = join(directory, 'packages with spaces #', 'stdlib');
  await cp('modules/stdlib', packageDirectory, { recursive: true });
  await writeFile(
    join(directory, 'main.ent'),
    '(module detached (graph sink main (inputs) (node value (call std.keep "isolated")) (output unit)) (entry main))',
  );
  const manifest = join(directory, 'project.json');
  await jsonFile(manifest, {
    target: 'nodejs',
    modules: ['./packages with spaces #/stdlib/package.json', './main.ent'],
  });
  const destination = join(directory, 'another', 'nested', 'app.mjs');
  const output = await compileFile(manifest, destination);
  assert.doesNotMatch(output.javascript, /http|\.\.\/runtime/);
  assert.match(output.javascript, /packages%20with%20spaces%20%23\/stdlib\/runtime\.mjs/);
  const { createProgram } = await import(pathToFileURL(destination));
  const app = createProgram();
  assert.equal(app.signatures['detached.main'], '(fn () Unit)');
  assert.equal(app.run(), undefined);
});

test('module dependency cycles, namespace collisions and missing local runtime fail early', async (t) => {
  const directory = await fixture(t);
  const a = join(directory, 'a.json'),
    b = join(directory, 'b.json'),
    project = join(directory, 'project.json');
  const module = (namespace, dependencies = []) => ({ entropy: { namespace, source: './module.ent', dependencies } });
  await writeFile(join(directory, 'module.ent'), '(module empty)');
  await jsonFile(a, module('a', ['./b.json']));
  await jsonFile(b, module('b', ['./a.json']));
  await jsonFile(project, { target: 'nodejs', modules: ['./a.json'] });
  await assert.rejects(loadBundle(project), /dependency cycle/);
  await jsonFile(a, module('same'));
  await jsonFile(b, module('same'));
  await jsonFile(project, { target: 'nodejs', modules: ['./a.json', './b.json'] });
  await assert.rejects(loadBundle(project), /Duplicate Entropy module namespace/);
  const missing = module('a');
  missing.entropy.platforms = { nodejs: { generator: 'stdlib', runtime: './missing.mjs' } };
  await jsonFile(a, missing);
  await jsonFile(project, { target: 'nodejs', modules: ['./a.json'] });
  await assert.rejects(loadBundle(project), /missing\.mjs/);
});

test('only explicitly loaded module generators are available to the compiler', async () => {
  const bundle = await loadBundle('examples/full-name/project.json');
  const withoutHttp = { ...bundle, nativeModules: bundle.nativeModules.filter((m) => m.generator !== 'http') };
  assert.throws(() => compileBundle(withoutHttp), /unregistered nodejs native generator: http.requests/);
  assert.throws(
    () => compileBundle({ ...bundle, nativeModules: [{ generator: 'unknown', runtime: './runtime.mjs' }] }),
    /unregistered nodejs module generator: unknown/,
  );
  const definition = JSON.parse(await readFile(resolve(root, 'modules/http/package.json'), 'utf8'));
  assert.deepEqual(definition.entropy.dependencies, ['../stdlib/package.json']);
});
