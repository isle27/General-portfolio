import fs from 'node:fs';
const file='src/index.html';
let html=fs.readFileSync(file,'utf8');
html=html.replace('<div class="portrait"><div class="portrait-orbit"></div>','<div class="portrait"><div class="portrait-orbit"></div>');
const icon=(slug,name)=>`<span class="technology"><img src="/assets/icons/${slug}.svg" alt="" width="23" height="23"><span>${name}</span></span>`;
const groups=[
 ['Languages',[['python','Python'],['javascript','JavaScript'],['typescript','TypeScript']]],
 ['Frameworks & Libraries',[['react','React'],['nodejs','Node.js'],['materialui','MUI'],['pytorch','PyTorch']]],
 ['Tools & Platforms',[['github','GitHub'],['docker','Docker'],['jenkins','Jenkins'],['linux','Linux']]],
 ['Databases & Delivery',[['postgresql','PostgreSQL'],['mongodb','MongoDB']]],
];
const skills=groups.map(([title,items])=>`<article><h3>${title}</h3><div class="technologies">${items.map(([slug,name])=>icon(slug,name)).join('')}</div>${title==='Databases & Delivery'?'<small>CI/CD · MLOps · APIs & model serving</small>':''}</article>`).join('');
const ai=[['Language & Reasoning',['LLMs & fine-tuning','Retrieval-augmented generation','Prompt & context engineering']],['Agents & Orchestration',['Agentic workflows','Tool use & orchestration','Human-in-the-loop systems']],['Evaluation & Trust',['LLM evaluation','Observability & tracing','Safety & reliability']],['From Model to Product',['Python & PyTorch','APIs & model serving','MLOps, Docker & CI/CD']]];
const start=html.indexOf('<div class="skill-grid">');
const end=html.indexOf('</section>',start);
html=html.slice(0,start)+`<div class="skill-grid">${skills}</div><div class="ai-skills"><div class="eyebrow centered"><i></i>AI ENGINEERING EXPERTISE<i></i></div><div class="expertise-grid">${ai.map(([title,items])=>`<article><h3>${title}</h3><ul>${items.map(s=>`<li>${s}</li>`).join('')}</ul></article>`).join('')}</div></div>`+html.slice(end);
html=html.replace('<div class="mountain one"></div><div class="mountain two"></div><div class="mountain three"></div>',`<svg class="wave wave-hero" viewBox="0 0 1440 240" preserveAspectRatio="none"><path class="wave-back" d="M-200 100 Q0 0 200 100 T600 100 T1000 100 T1400 100 T1800 100 V300 H-200Z"/><path class="wave-front" d="M-200 150 Q0 60 200 150 T600 150 T1000 150 T1400 150 T1800 150 V300 H-200Z"/></svg><svg class="wave wave-skills" viewBox="0 0 1440 240" preserveAspectRatio="none"><path class="wave-back" d="M-200 100 Q0 0 200 100 T600 100 T1000 100 T1400 100 T1800 100 V300 H-200Z"/><path class="wave-front" d="M-200 150 Q0 60 200 150 T600 150 T1000 150 T1400 150 T1800 150 V300 H-200Z"/></svg>`);
fs.writeFileSync(file,html);
