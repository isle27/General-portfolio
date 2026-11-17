const {chromium}=require('../Ai-portfolio/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1536,height:900}});
 await page.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
 const session=await page.context().newCDPSession(page);
 await session.send('Emulation.setCPUThrottlingRate',{rate:4});
 await session.send('Tracing.start',{categories:'devtools.timeline',transferMode:'ReturnAsStream'});
 const gaps=await page.evaluate(()=>new Promise(resolve=>{
  const frames=[];let last=performance.now(),step=0;
  function frame(now){frames.push(now-last);last=now;window.scrollTo({top:step*10,behavior:'instant'});if(++step<100)requestAnimationFrame(frame);else resolve(frames.slice(5))}requestAnimationFrame(frame);
 }));
 const ended=new Promise(resolve=>session.once('Tracing.tracingComplete',resolve));await session.send('Tracing.end');
 const {stream}=await ended;let raw='';for(;;){const chunk=await session.send('IO.read',{handle:stream});raw+=chunk.data;if(chunk.eof)break}await session.send('IO.close',{handle:stream});
 const events=JSON.parse(raw).traceEvents;const sum=name=>Math.round(events.filter(e=>e.name===name&&e.ph==='X').reduce((a,e)=>a+(e.dur||0),0)/1000);
 gaps.sort((a,b)=>a-b);
 console.log(JSON.stringify({paintMs:sum('Paint'),layoutMs:sum('Layout'),styleMs:sum('UpdateLayoutTree'),p95FrameMs:Math.round(gaps[Math.floor(gaps.length*.95)]),slowFrames:gaps.filter(t=>t>34).length}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
