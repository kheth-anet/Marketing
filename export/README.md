# Compass Math Reports — Demo Site

Design prototype of the Compass Math Teacher Report (ANet demo school). Two layers live here:

## `site/` — what gets published
Self-contained standalone HTML, one file per page. This is the GitHub Pages root.

- `index.html` — redirects to the Teacher Report.
- `Compass Math Teacher Report.html` — the published report.

No build step. Pages load React/Babel and the Lato font from a CDN at runtime, so viewing
needs an internet connection.

## Root `*.dc.html` — the editable source
The source designs. Each is a single HTML file that opens directly in a browser.

- `Compass Math Teacher Report.dc.html` — current report.
- `Compass Math Teacher Report (Preview).dc.html` — in-progress variant.

Supporting files these load at runtime (keep them alongside):

- `support.js` — the component runtime. Required; the pages are blank without it.
- `lcmap.js` — learning components by grade + milestone.
- `lcfullmap.js` — full learning-component descriptions.
- `qdata.js` — assessment question items.
- `assets/` — logo and question-item images, referenced by relative path.

A third report (Multi-School Diagnostic) exists in the design tool but is not ready and is
deliberately not included here.

## Publishing to GitHub Pages

First time:

```bash
git init
git add .
git commit -m "Initial import"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment** → Source **Deploy from a branch**,
branch `main`, folder `/site` → Save. Live in ~1 minute at
`https://<user>.github.io/<repo>/`.

Routine updates: replace the changed files with fresh copies from the design tool, then
commit and push. Pages redeploys automatically.

## Notes for Claude Code

- These are design prototypes, not production code — don't refactor them into a framework,
  a build pipeline, or a component library.
- Styling is intentionally all inline. There is no stylesheet and no design-token file.
- Don't rename report files; the Pages links and the published URLs depend on them.
- Edit the root `.dc.html` files for design changes. The files in `site/` are generated
  exports — regenerate them rather than hand-editing.
