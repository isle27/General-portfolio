# Elsa Wubie — General Portfolio

Run `npm.cmd run dev` on Windows, or `npm run dev` elsewhere, then open the URL printed in the terminal.

## Deploy to Vercel

Import this repository with **Root Directory** set to its root (`./`) and **Framework Preset** set to **Other**. The checked-in `vercel.json` configures `npm run build` and the `public` output directory. No dependency installation is required. Use Node.js 22 or newer.

Add `DATABASE_URL` in Vercel's project environment variables using the same Neon connection string as the AI portfolio. Enable it for Production and Preview as needed, then redeploy. This secret is used only by `/api/projects`; it is never included in browser assets. The page and software projects work without it; AI projects show an unavailable message until it is configured.

AI projects read `public.portfolio_published_projects`, filtered by `show_on_ai` and ordered by `sort_order, id`, matching the AI portfolio. Publish projects in Portfolio Studio with AI Engineering enabled. The view excludes unpublished projects; do not switch this reader back to the legacy `public.projects` table or add a separate sample filter. The database reader needs SELECT access to the shared view. No project list is copied into the build, so publishing changes appear on the next request without rebuilding.

Run `npm run check` before deployment. It includes regression tests for the publishing contract, field mapping, empty results, and API failures.

The app files in `elsa-portfolio/` must be regular tracked files, not a Git submodule. The previous nested Git history is preserved locally in `.local-history/elsa-portfolio.git`, which is ignored. Sites builds remain available with `npm --prefix elsa-portfolio run build`.
