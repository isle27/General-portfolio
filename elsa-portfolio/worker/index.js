export async function projectQuery(connectionString){
 const url=new URL(connectionString);if(!url.hostname.endsWith('.neon.tech'))throw new Error('Invalid database host');
 const response=await fetch('https://'+url.hostname+'/sql',{method:'POST',headers:{'Content-Type':'application/json','Neon-Connection-String':connectionString,'Neon-Raw-Text-Output':'false','Neon-Array-Mode':'false'},body:JSON.stringify({query:`SELECT project_slug AS slug, title, description,
   CASE WHEN image LIKE '/%' THEN
     CASE WHEN show_on_se THEN 'https://elsadev.chanyalew.com' ELSE 'https://elsiai.chanyalew.com' END || image
     ELSE image END AS image,
   COALESCE(NULLIF(ai_category, ''), 'Project') AS category,
   technologies AS stack, github AS github_url, live AS demo_url
   FROM public.portfolio_published_projects
   WHERE show_on_ai
   ORDER BY sort_order, id`,params:[]}),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('Database query failed');const result=await response.json();if(!Array.isArray(result.rows))throw new Error('Invalid query result');return result.rows;
}
export default {async fetch(request,env){const url=new URL(request.url);if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});if(url.pathname==='/api/projects'){try{const projects=await projectQuery(env.DATABASE_URL);return Response.json({projects},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Projects temporarily unavailable'},{status:503})}}const asset=assets[url.pathname];if(!asset)return new Response('Not found',{status:404});const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':url.pathname==='/'?'no-cache':'public, max-age=3600'}})}};
