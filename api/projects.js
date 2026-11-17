import { projectQuery } from '../elsa-portfolio/worker/index.js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const projects = await projectQuery(process.env.DATABASE_URL);
    if (request.method === 'HEAD') return response.status(200).end();
    return response.status(200).json({ projects });
  } catch {
    return response.status(503).json({ error: 'Projects temporarily unavailable' });
  }
}
