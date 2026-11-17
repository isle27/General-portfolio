import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(root, 'elsa-portfolio');
const output = path.join(root, 'public');
fs.mkdirSync(output, { recursive: true });
for (const [source, target] of [['src/index.html', 'index.html'], ['src/app.js', 'app.js']]) {
  fs.copyFileSync(path.join(app, source), path.join(output, target));
}
fs.writeFileSync(path.join(output, 'style.css'),
  fs.readFileSync(path.join(app, 'src/style.css'), 'utf8') + '\n' +
  fs.readFileSync(path.join(app, 'src/refinements.css'), 'utf8'));
fs.cpSync(path.join(app, 'dist/assets'), path.join(output, 'assets'), { recursive: true });
console.log('Built Vercel static website in public/; /api/projects runs as a Vercel Function.');
