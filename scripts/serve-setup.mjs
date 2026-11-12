import http from 'node:http';
import { readFile } from 'node:fs/promises';

const host = process.argv.includes('--host=0.0.0.0') ? '0.0.0.0' : '127.0.0.1';
const port = Number(process.env.SETUP_PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SETUP_PORT debe ser un puerto válido.');
const fixture = await readFile(new URL('../tests/fixtures/setup.html', import.meta.url));
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const headers = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  };
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); response.end(); return;
  }
  if (pathname === '/healthz') {
    response.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
    response.end(request.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok', scope: 'tooling-only' })); return;
  }
  if (pathname === '/' || pathname === '/setup/') {
    response.writeHead(200, { ...headers, 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : fixture); return;
  }
  response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(request.method === 'HEAD' ? undefined : 'No encontrado');
});
server.listen(port, host, () => console.log(`Comprobación de herramientas: http://${host}:${port}/setup/ (no es VERVO)`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));
