import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { compileBundle, loadBundle } from './compile.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(process.argv[2] ?? resolve(root, 'examples/full-name/project.json'));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const model = compileBundle(await loadBundle(manifestPath)).visualization;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
model.title = manifest.name ?? 'Entropy graph';
model.repository = 'https://github.com/bracketedrebels/entropy';
model.revision = process.env.GITHUB_SHA || (git('status', '--porcelain') === '' ? git('rev-parse', 'HEAD') : null);
model.sourceRef = model.revision || git('branch', '--show-current');
model.sources = model.sources.map((source) => ({
  ...source,
  path: relative(root, resolve(dirname(manifestPath), source.name)).replaceAll('\\', '/'),
}));
const destination = resolve(root, '_site');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(resolve(root, 'viewer'), destination, { recursive: true });
await writeFile(resolve(destination, 'graph.json'), `${JSON.stringify(model, null, 2)}\n`);
await writeFile(resolve(destination, '.nojekyll'), '');
console.log(`Pages: ${model.graphs.length} graphs, ${model.elements.length} elements → _site/`);
