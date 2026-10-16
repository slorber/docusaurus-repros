# Repro: facebook/docusaurus#8938

Issue: https://github.com/facebook/docusaurus/issues/8938

**Result: the bug no longer reproduces with Docusaurus `4.0.0-canary-6975` (nor with `3.10.2`).**

## The bug

With `respectPrefersColorScheme: false`, a user picks dark mode with the navbar toggle. When the OS color scheme changes, the site switches back to `defaultMode` (light) and the stored choice is deleted from `localStorage`. The theme stays light after a reload.

Up to Docusaurus `3.7.0`, every OS color scheme change reset the color mode. Since [#10987](https://github.com/facebook/docusaurus/pull/10987) (released in `3.8.0`), the site only follows OS changes when `respectPrefersColorScheme` is `true` and the user hasn't picked a color mode. OS changes are never persisted.

## Setup

- `docusaurus.config.js`: the default `colorMode` config from the issue, written out (`defaultMode: 'light'`, `respectPrefersColorScheme: false`).
- `src/pages/index.js`: a single page.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

1. Put your OS in light mode, or in Chrome DevTools open the Rendering panel and set "Emulate CSS media feature prefers-color-scheme" to `light`.
2. Open http://localhost:3000/ and click the navbar color mode toggle once: the site is dark.
3. Switch the OS (or DevTools emulation) to dark, then back to light.
4. Reload the page.

## Expected result

The site stays dark through steps 3 and 4. `<html>` keeps `data-theme="dark"` and `data-theme-choice="dark"`, and `localStorage` keeps `theme-<hash>: "dark"` (Docusaurus v4 namespaces the storage key per site).

The same holds with `respectPrefersColorScheme: true`: the toggle cycles between system, light and dark modes. An explicit light or dark choice survives OS changes, and only the system mode follows the OS live.

## Seeing the original bug

Install the last version before the fix. Docusaurus `3.7.0` doesn't build with recent webpack versions, so webpack is pinned to `5.97.1`:

```bash
rm -rf node_modules package-lock.json build .docusaurus
npm pkg set overrides.webpack=5.97.1
npm install --save-exact @docusaurus/core@3.7.0 @docusaurus/preset-classic@3.7.0
npm run build
npm run serve
```

With the same steps, the site turns light as soon as the OS switches to dark (step 3), the `theme` key is removed from `localStorage`, and the site stays light after a reload. Docusaurus `2.4.0`, the version from the issue, behaves the same.
