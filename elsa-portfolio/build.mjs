import fs from 'node:fs';
fs.mkdirSync('dist/server',{recursive:true});
const assets={};
const files=fs.readdirSync('dist/assets',{recursive:true}).filter(f=>fs.statSync('dist/assets/'+f).isFile());
for(const [url,file,type] of [['/','src/index.html','text/html; charset=utf-8'],['/style.css','src/style.css','text/css; charset=utf-8'],['/app.js','src/app.js','text/javascript; charset=utf-8'],...files.map(f=>['/assets/'+f.replaceAll('\\','/'),'dist/assets/'+f,f.endsWith('.svg')?'image/svg+xml':f.endsWith('.jpg')?'image/jpeg':'image/png'])])assets[url]={data:(url==='/style.css'?Buffer.concat([fs.readFileSync(file),Buffer.from('\n'),fs.readFileSync('src/refinements.css')]):fs.readFileSync(file)).toString('base64'),type};
const worker=fs.readFileSync('worker/index.js','utf8');fs.writeFileSync('dist/server/index.js','const assets='+JSON.stringify(assets)+';\n'+worker);console.log('Built Worker and '+Object.keys(assets).length+' assets');
