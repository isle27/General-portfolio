import test from 'node:test';
import assert from 'node:assert/strict';
import { projectQuery } from '../elsa-portfolio/worker/index.js';
import handler from '../api/projects.js';

test('AI projects use the shared publishing contract and preserve current project data', async (t) => {
  const projects = [{ slug: 'interview-me', title: 'Interview Me', stack: ['AI'], demo_url: 'https://interview.lockitech.com/' }];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://example.neon.tech/sql');
    const { query, params } = JSON.parse(options.body);
    assert.match(query, /FROM public\.portfolio_published_projects\s+WHERE show_on_ai\s+ORDER BY sort_order, id/);
    assert.doesNotMatch(query, /FROM public\.projects\b|sample\s*=/);
    for (const mapping of ['project_slug AS slug', 'technologies AS stack', 'github AS github_url', 'live AS demo_url']) {
      assert.ok(query.includes(mapping), mapping);
    }
    assert.match(query, /https:\/\/elsadev\.chanyalew\.com/);
    assert.match(query, /https:\/\/elsiai\.chanyalew\.com/);
    assert.deepEqual(params, []);
    return Response.json({ rows: projects });
  });
  assert.deepEqual(await projectQuery('postgresql://reader:secret@example.neon.tech/db'), projects);
});

test('database errors and malformed results remain errors, never empty success', async (t) => {
  for (const result of [new Response('', { status: 500 }), Response.json({ unexpected: [] })]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => result);
    await assert.rejects(projectQuery('postgresql://reader:secret@example.neon.tech/db'));
    mock.mock.restore();
  }
  await assert.rejects(projectQuery(undefined));
  await assert.rejects(projectQuery('postgresql://reader:secret@untrusted.example/db'));
});

test('API returns fresh data, distinguishes empty results, and protects failure details', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ rows: [] }));
  const previous = process.env.DATABASE_URL;
  process.env.DATABASE_URL = 'postgresql://reader:secret@example.neon.tech/db';
  t.after(() => { if (previous === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previous; });
  const response = () => ({ headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; }, end() { return this; } });
  const success = response();
  await handler({ method: 'GET' }, success);
  assert.equal(success.code, 200);
  assert.deepEqual(success.body, { projects: [] });
  assert.equal(success.headers['Cache-Control'], 'no-store');
  const head = response();
  await handler({ method: 'HEAD' }, head);
  assert.equal(head.code, 200);
  assert.equal(head.body, undefined);
  delete process.env.DATABASE_URL;
  const failure = response();
  await handler({ method: 'GET' }, failure);
  assert.equal(failure.code, 503);
  assert.deepEqual(failure.body, { error: 'Projects temporarily unavailable' });
  const rejected = response();
  await handler({ method: 'POST' }, rejected);
  assert.equal(rejected.code, 405);
});
