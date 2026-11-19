import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { createProgram } = await import(pathToFileURL(resolve(process.argv[2] ?? 'dist/full-name.mjs')));
const app = createProgram({ port: Number(process.env.PORT ?? 3000), hostname: process.env.HOST ?? '127.0.0.1' });
const { url } = await app.start();
console.log(`Entropy: ${url}?first=Dan&last=Mironenko`);
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => void app.stop().catch(error => { console.error(error); process.exitCode = 1; }));
