import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import worker from './dist/server/index.js';

for (const file of ['.env', '../../Ai-portfolio/.env']) {
  if (fs.existsSync(file)) { process.loadEnvFile(file); break; }
}

let port = Number(process.env.PORT || 3000);
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const sources = { '/': ['src/index.html', 'text/html; charset=utf-8'], '/style.css': ['src/style.css', 'text/css; charset=utf-8'], '/app.js': ['src/app.js', 'text/javascript; charset=utf-8'] };
    let source = sources[pathname];
    if (pathname.startsWith('/assets/')) {
      const asset = path.resolve('dist', '.' + decodeURIComponent(pathname));
      if (asset.startsWith(path.resolve('dist/assets') + path.sep) && fs.existsSync(asset) && fs.statSync(asset).isFile()) {
        source = [asset, asset.endsWith('.svg') ? 'image/svg+xml' : asset.endsWith('.jpg') ? 'image/jpeg' : 'image/png'];
      }
    }
    if (source && ['GET', 'HEAD'].includes(req.method)) {
      const body = pathname === '/style.css' ? Buffer.concat([fs.readFileSync(source[0]), Buffer.from('\n'), fs.readFileSync('src/refinements.css')]) : fs.readFileSync(source[0]);
      res.writeHead(200, { 'Content-Type': source[1], 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? null : body);
      return;
    }
    const request = new Request(`http://localhost:${port}${req.url}`, { method: req.method });
    const response = await worker.fetch(request, process.env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end('Local preview error');
  }
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < 3010 && !process.env.PORT) {
    console.log(`Port ${port} is already in use; trying ${port + 1}…`);
    port += 1;
    server.listen(port, '127.0.0.1');
    return;
  }
  console.error(`Could not start the preview: ${error.message}`);
  process.exitCode = 1;
});
server.on('listening', () => console.log(`Portfolio preview: http://localhost:${port}`));
server.listen(port, '127.0.0.1');
