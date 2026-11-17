import fs from 'node:fs';
fs.mkdirSync('dist/assets/icons',{recursive:true});
await Promise.all(['python','javascript','typescript','react','nodejs','materialui','pytorch','github','docker','jenkins','linux','postgresql','mongodb'].map(async name=>{
 const r=await fetch(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${name}/${name}-original.svg`);
 if(!r.ok)throw Error(`Icon unavailable: ${name}`);
 fs.writeFileSync(`dist/assets/icons/${name}.svg`,await r.text());
}));
console.log('Downloaded 13 locally served technology icons');
