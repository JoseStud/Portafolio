# Jose Gabriel Sierra Ariza Portfolio

This is a static single-page portfolio for Jose Gabriel Sierra Ariza, a software engineer and AI automation specialist. It has no framework dependency, and its generated browser bundle is maintained with dependency-free Node scripts.

## Structure

- `index.html` contains the document structure and panel markup.
- `styles/main.css` imports focused CSS files from `styles/`, with shared visual tokens in `styles/tokens.css`.
- `scripts/main.js` is the ES module entrypoint for the source behavior modules.
- `scripts/modules/` contains focused JavaScript modules for content data, rendering, cursor, menu/panels, scroll progress, clock, toggle, and parallax.
- `scripts/site.js` is the generated classic runtime bundle loaded by `index.html` so the site still works when opened directly from disk.

## Run

Open `index.html` directly in a browser, or serve the directory with any static server:

```sh
python3 -m http.server
```

The repository also includes dependency-free Node maintenance scripts:

```sh
npm run serve
```

This serves the site at `http://127.0.0.1:4173/`. Override the port with `PORT=8080 npm run serve`.

## Maintenance

```sh
npm run check
npm run build:scripts
npm run screenshots
npm run verify
```

- `npm run build:scripts` regenerates `scripts/site.js` from the ES module source files.
- `npm run check` regenerates the runtime bundle, then runs `node --check` over `scripts/` and `tools/`.
- `npm run screenshots` uses installed Chromium to capture desktop and mobile PNGs from `index.html`.
- `npm run verify` runs the syntax checks and screenshot capture together.

The screenshot command writes generated captures to `screenshots/current/`, which is ignored by git. Keep approved baseline images in `screenshots/reference/` so they can be reviewed and tracked. A typical update flow is:

```sh
npm run screenshots
cp screenshots/current/desktop.png screenshots/reference/desktop.png
cp screenshots/current/mobile.png screenshots/reference/mobile.png
```

If Chromium is installed somewhere non-standard, run the capture with `CHROMIUM=/path/to/chromium npm run screenshots`.
