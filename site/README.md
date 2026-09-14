# Compass Math Teacher Report Demo

Self-contained HTML prototype for the ANet / Compass Math demo. Each page is a single
standalone file — no build step, no install. The pages load React/Babel and the Lato
font from a CDN at runtime, so viewing them needs an internet connection.

## Pages

- `index.html` — redirects to the Performance report (entry point).
- `Compass Math Teacher Report.html` — Performance tab (Prepare for Instruction / Review Performance).

## Publish with GitHub Pages

1. Create a new repository on GitHub.
2. Upload the contents of this folder to the repo root.
3. In the repo, go to **Settings → Pages**, set **Source** to `Deploy from a branch`,
   branch `main` / folder `/ (root)`, and save.
4. The site goes live at `https://<username>.github.io/<repo-name>/` in about a minute.
