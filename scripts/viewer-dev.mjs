import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../_site');
const option = (name) => {
  const i = process.argv.indexOf(name);
  return i < 0 ? undefined : process.argv[i + 1];
};
const port = Number(option('--port') ?? process.env.PORT ?? 5173);
const host = option('--host') ?? '0.0.0.0';
const mime = {
  '.html': 'text/html',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};
createServer(async (request, response) => {
  try {
    let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (path === '/entropy') {
      response.writeHead(302, { location: '/entropy/' }).end();
      return;
    }
    if (path.startsWith('/entropy/')) path = path.slice('/entropy'.length);
    const file = resolve(root, `.${path.endsWith('/') ? `${path}index.html` : path}`);
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const data = await readFile(file);
    response
      .writeHead(200, {
        'content-type': `${mime[extname(file)] ?? 'application/octet-stream'}; charset=utf-8`,
        'cache-control': 'no-store',
      })
      .end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, host, () => console.log(`Entropy viewer: http://${host}:${port}`));
