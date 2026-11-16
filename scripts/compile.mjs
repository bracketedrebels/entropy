import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function loadBundle(manifestPath) {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const directory = dirname(resolve(manifestPath));
  const sources = await Promise.all(manifest.modules.map(async name => ({ name, text: await readFile(resolve(directory, name), 'utf8') })));
  const schemas = Object.fromEntries(await Promise.all(Object.entries(manifest.schemas).map(async ([name, file]) => [name, JSON.parse(await readFile(resolve(directory, file), 'utf8'))])));
  return { target: manifest.target, sources, schemas, config: manifest.config ?? {} };
}
export function compileBundle(bundle) {
  const compiler = process.env.ENTROPY_COMPILER ?? resolve(root, '_build/native/release/build/cmd/entropy/entropy.exe');
  // Native-компилятор — отдельный процесс. argv — небольшой M1-протокол;
  // для больших проектов его нужно заменить на stdin/файловый host.
  const result = spawnSync(compiler, [JSON.stringify(bundle)], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.error) throw result.error;
  let output;
  try { output = JSON.parse(result.stdout); }
  catch { throw new Error(`Compiler did not return JSON: ${result.stderr || result.stdout}`); }
  if (result.status !== 0) throw new Error(output.error ?? result.stderr);
  return output;
}
export async function compileFile(manifest, destination) {
  const runtimePath = relative(dirname(resolve(destination)), resolve(root, 'runtime')).replaceAll('\\', '/');
  const runtimeImport = runtimePath.startsWith('.') ? runtimePath : `./${runtimePath}`;
  const output = compileBundle({ ...await loadBundle(manifest), runtimeBase: runtimeImport });
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
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
