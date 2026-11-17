# Elsa Wubie portfolio

Run `npm run build` to produce the self-contained Cloudflare Worker at `dist/server/index.js`. Source is in `src/` and `worker/`. No dependency installation is required.

Set the production runtime secret `DATABASE_URL` to the existing AI portfolio's Neon connection string. The read-only project endpoint uses the existing `public.projects` table; it never runs migrations or changes shared data. Only published, non-sample records are displayed. Software projects and screenshots come from the local SE-Portfolio source. The two focus buttons replace About Me with projects; click the selected focus again or About Me to return.

The database credential must never be placed in browser assets. Local verification: `npm run check` and `npm run build`.
