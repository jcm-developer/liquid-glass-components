# Operations

Local preview, deploy, CI, versioning and release checks. Owner of every fact about how the
project runs outside the code itself.

## Local preview

There is nothing to install or build. Serve the repository root (not `site/`) so the landing
can reach `../skills/`:

```bash
npx serve .            # or: python -m http.server 8000
# open http://localhost:3000/site/ (or :8000/site/)
```

Opening `site/index.html` straight from the file system also works. The only difference is
the "Code" drawer: browsers block `fetch` on `file://`, so it falls back to the copy on
GitHub (`loadSnippet` in `site/index.html`), which shows the last pushed version.

## Deploy

GitHub Pages, built by `.github/workflows/pages.yml` on every push to `main` (and on manual
dispatch). The job:

1. copies `site/index.html` and `skills/` into `_site/`;
2. rewrites `../skills/` to `./skills/` in `_site/index.html`, so the page works at the site
   root;
3. adds `.nojekyll` and publishes `_site/` with `actions/deploy-pages`.

Live URL: `https://jcm-developer.github.io/liquid-glass-components/`.

**One-time setup:** repository Settings, Pages, Build and deployment, Source: **GitHub
Actions**. Until that is set the workflow fails at the deploy step.

## CI

`.github/workflows/ci.yml` runs on every push and pull request; every step blocks.

- `docs`: `node scripts/check-docs.mjs`. It fails on:
  - an em dash (U+2014) in any tracked text file;
  - a relative Markdown link or anchor that does not resolve;
  - a snippet missing from the `SKILL.md` table, `docs/domains/components.md` or the
    `<link>` list in `site/index.html`, or a listed snippet that does not exist;
  - a component missing from the derived-token `:where()` list in `tokens.css`;
  - a snippet, `liquid-glass.js` or `SKILL.md` version that differs from the others;
  - a universal prompt that differs between `README.md` and `site/index.html`.

It needs Node 18 or later and no dependencies.

## Versioning

Semantic versioning for the whole library: every snippet header, `VERSION` in
`liquid-glass.js` and `metadata.version` in `SKILL.md` carry the same number. A visual change
to a component is at least a minor bump; a removed class or token is a major bump.

## README images

`.github/assets/banner.png` (README header) and `.github/assets/social-preview.png` (the
repository's social preview, under 1 MB) are screenshots of `.github/assets/banner.html`,
which loads the shipped snippets so the glass is the real material. Regenerate both after a
visual change to the components in the banner, with Chrome:

```bash
chrome --headless=new --hide-scrollbars --window-size=1280,640 --virtual-time-budget=6000 \
  --force-device-scale-factor=2 --default-background-color=00000000 \
  --screenshot=.github/assets/banner.png "file://$PWD/.github/assets/banner.html"
chrome --headless=new --hide-scrollbars --window-size=1280,640 --virtual-time-budget=6000 \
  --force-device-scale-factor=1 --default-background-color=08080aff \
  --screenshot=.github/assets/social-preview.png "file://$PWD/.github/assets/banner.html"
```

Headless Chrome reports the Chromium brand, so refraction renders. The social preview is
uploaded by hand: repository Settings, General, Social preview.

## Release checks

`check-docs.mjs` does not look at pixels. Before merging anything that changes how a component
looks or behaves, check by hand:

- Chrome desktop: refraction on (default) and off (`<html data-glass-refract="off">`).
- Safari and Firefox: the blur fallback reads well over a busy backdrop.
- Emulated `prefers-reduced-transparency`, `prefers-contrast: more`, `forced-colors` and
  `prefers-reduced-motion` (Chrome DevTools, Rendering panel).
- The landing at 390px wide: no horizontal scroll.
