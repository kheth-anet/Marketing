# Compass Math Teacher Report — Prototype

A self-contained HTML prototype of the Compass Math Teacher Report, published via GitHub Pages.

- `index.html` — the entire prototype in a single file (no build step, no dependencies to install).
  It loads React/Babel from a CDN at runtime, so it needs an internet connection to render.

## Live site

Once Pages is enabled (see below), this is served at:
`https://<your-username>.github.io/<repo-name>/`

---

## First-time setup (do this once)

1. Create a new **public** repository on GitHub, e.g. `compass-math-report`.
2. On your machine, in an empty folder:
   ```bash
   git init
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   ```
3. Copy this folder's contents (`index.html`, `README.md`) into that folder.
4. First push:
   ```bash
   git add .
   git commit -m "Initial prototype"
   git branch -M main
   git push -u origin main
   ```
5. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)** → **Save**
6. Wait ~1 minute. Your prototype is live at the URL above.

---

## Routine updates (Claude Code workflow)

Keep this folder as your local git repo. When you want to publish new changes:

1. Get the updated `index.html` (export a fresh standalone from the design tool) and drop it
   into this folder, replacing the old one.
2. In Claude Code, from this folder, just say:
   > "Push the latest changes."
   Claude Code will run the equivalent of:
   ```bash
   git add .
   git commit -m "Update prototype"
   git push
   ```
3. GitHub Pages redeploys automatically on every push — the live URL updates in ~1 minute.

That's the whole loop: new `index.html` in this folder → "push the latest changes" → live.

---

## Notes

- The prototype is **not** production code — it's a design reference/prototype built in HTML.
- Because React/Babel load from a CDN, the page won't render fully offline. For a hosted
  Pages link that's fine; if you need true offline use, tell the designer and they can inline
  those libraries too.
