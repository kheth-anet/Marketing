# Compass Math Guided Tour

## What's here
- `tour.html` — the shareable page. Loads the real report directly from the repo
  root (not a copy) and drives the guided walkthrough on top of it.
- `tour.css`, `tour.js`, `tour-steps.js` — the tour engine and content.

That's it — no duplicated `report.dc.html`, `support.js`, or `assets/` this time.
The iframe points straight at `Compass Math Teacher Report (Preview).dc.html` at
the repo root, so any future update to that file is picked up automatically with
zero re-sync step. This replaces the earlier version of this package, which did
carry a local copy — that approach is deprecated as of this build.

## File placement
Drop all four files into the **repo root**, alongside the existing report files —
same directory as `Compass Math Teacher Report (Preview).dc.html`,
`spot-the-misconception.html`, `support.js`, etc. Nothing else needs to move.

## Adding the redirect
Your existing `_redirects` file has one rule:

```
/game   /spot-the-misconception.html   200
```

Add a second line for the tour, same pattern:

```
/game          /spot-the-misconception.html   200
/compass-tour  /tour.html                     200
```

## Branch question (worth deciding before merging)
The booth game's redirect lives on `marketing/events-booth-activity`, which is
also what's currently live. Two options for where the tour goes:

1. **Same branch** — add these files and the redirect line directly to
   `marketing/events-booth-activity`. Matches the booth game's setup exactly, and
   `/compass-tour` goes live immediately alongside `/game`. Risk: any bug in the
   tour is live on the same production deploy as the working booth game.
2. **New branch first** (e.g. `product-tour/teacher-report`) — build and test on
   its own preview URL, then merge the files and the redirect line into
   `marketing/events-booth-activity` once it's verified. Same end state, less risk
   in the meantime.

No code difference between the two — this is purely about when you merge. Given
this is going to external prospects, option 2 seems safer for a first real test,
but option 1 is simpler if you'd rather just ship and iterate.

## Before this goes external
- [ ] Test live in a browser — this has only been verified by static analysis so
      far, not an actual click-through.
- [ ] Send Alicia the `data-tour` attribute list and swap the `type: "text"`
      entries in `tour-steps.js` to `type: "data"` once she's added them.
- [ ] Swap placeholder colors in `tour.css` (`--tour-navy`, `--tour-orange`) for
      exact values from Anna's design system.
- [ ] Set `HUBSPOT_PORTAL_ID` in `tour.js` and uncomment the tracking script tag in
      `tour.html` once ready to wire up analytics for real.
- [ ] Decide real CTA destinations for the close step (currently a TODO in
      `nextStep()` in `tour.js`).
- [ ] Confirm the double-match on "Prepare for Instruction" / "Review Performance"
      tab labels resolves to the correct (visible, clickable) element once tested
      live — the source has two matching spans and the engine currently takes the
      first one.
