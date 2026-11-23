import { readFile, writeFile, mkdir, realpath, access } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Декларации и runtime разрешаются от собственного package.json модуля.
// Манифест проекта перечисляет пакеты/исходники; не знает их внутренние файлы.
export async function loadBundle(manifestPath, { destination = resolve(root, 'dist/full-name.mjs') } = {}) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const directory = dirname(resolve(manifestPath));
  const sources = [],
    nativeModules = [];
  const visited = new Set(),
    visiting = new Set(),
    loadedSources = new Set(),
    namespaces = new Map();
  const projectName = (path) => relative(directory, path).replaceAll('\\', '/');
  const moduleImport = (path) => {
    const name = relative(dirname(resolve(destination)), path)
      .replaceAll('\\', '/')
      .split('/')
      .map(encodeURIComponent)
      .join('/');
    return name.startsWith('../') ? name : `./${name}`;
  };
  async function source(path) {
    const absolute = await realpath(path);
    if (loadedSources.has(absolute)) return;
    loadedSources.add(absolute);
    sources.push({ name: projectName(absolute), text: await readFile(absolute, 'utf8') });
  }
  async function load(path) {
    const absolute = await realpath(path);
    if (absolute.endsWith('.ent')) return source(absolute);
    if (visiting.has(absolute)) throw new Error(`Entropy module dependency cycle: ${projectName(absolute)}`);
    if (visited.has(absolute)) return;
    visiting.add(absolute);
    const metadata = JSON.parse(await readFile(absolute, 'utf8'));
    const module = metadata.entropy;
    if (!module || typeof module.namespace !== 'string' || typeof module.source !== 'string') {
      throw new Error(`Invalid Entropy package manifest: ${projectName(absolute)}`);
    }
    if (namespaces.has(module.namespace) && namespaces.get(module.namespace) !== absolute) {
      throw new Error(`Duplicate Entropy module namespace: ${module.namespace}`);
    }
    namespaces.set(module.namespace, absolute);
    const dependencies = module.dependencies ?? [];
    if (!Array.isArray(dependencies) || dependencies.some((path) => typeof path !== 'string'))
      throw new Error(`Invalid dependencies in ${projectName(absolute)}`);
    const base = dirname(absolute);
    for (const dependency of dependencies) await load(resolve(base, dependency));
    await source(resolve(base, module.source));
    const platform = module.platforms?.[manifest.target];
    if (module.platforms && !platform)
      throw new Error(`Module ${module.namespace} does not support target ${manifest.target}`);
    if (platform) {
      if (typeof platform.generator !== 'string' || typeof platform.runtime !== 'string')
        throw new Error(`Invalid ${manifest.target} platform in ${projectName(absolute)}`);
      const runtime = await realpath(resolve(base, platform.runtime));
      await access(runtime);
      nativeModules.push({
        namespace: module.namespace,
        generator: platform.generator,
        runtime: moduleImport(runtime),
      });
    }
    visiting.delete(absolute);
    visited.add(absolute);
  }
  for (const path of manifest.modules) await load(resolve(directory, path));
  const schemas = Object.fromEntries(
    await Promise.all(
      Object.entries(manifest.schemas ?? {}).map(async ([name, file]) => [
        name,
        JSON.parse(await readFile(resolve(directory, file), 'utf8')),
      ]),
    ),
  );
  return { target: manifest.target, sources, schemas, nativeModules, config: manifest.config ?? {} };
}
export function compileBundle(bundle) {
  const compiler = process.env.ENTROPY_COMPILER ?? resolve(root, '_build/native/release/build/cmd/entropy/entropy.exe');
  // Native-компилятор — отдельный процесс. argv — небольшой M1-протокол;
  // для больших проектов его нужно заменить на stdin/файловый host.
  const result = spawnSync(compiler, [JSON.stringify(bundle)], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.error) throw result.error;
  let output;
  try {
    output = JSON.parse(result.stdout);
  } catch {
    throw new Error(`Compiler did not return JSON: ${result.stderr || result.stdout}`);
  }
  if (result.status !== 0) throw new Error(output.error ?? result.stderr);
  return output;
}
export async function compileFile(manifest, destination) {
  const output = compileBundle(await loadBundle(manifest, { destination }));
  await mkdir(dirname(resolve(destination)), { recursive: true });
  await writeFile(destination, output.javascript);
  await writeFile(`${destination}.types.json`, `${JSON.stringify(output.signatures, null, 2)}\n`);
  return output;
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? '')).href) {
  try {
    if (process.argv.length !== 4) throw new Error('usage: node scripts/compile.mjs project.json output.mjs');
    await compileFile(process.argv[2], process.argv[3]);
    console.log(`Compiled ${process.argv[2]} -> ${process.argv[3]}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
