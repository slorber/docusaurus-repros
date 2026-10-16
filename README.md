# Repro: facebook/docusaurus#7728

Issue: https://github.com/facebook/docusaurus/issues/7728

**Result: the bug still reproduces with Docusaurus `3.10.1-canary-6591`.**

## The bug

Third-party plugins depend on Docusaurus core packages with ranges like `^3.9.0`. Canary versions are semver prereleases (`3.10.1-canary-6591`), and prereleases don't satisfy these ranges. npm installs a second, stable copy of `@docusaurus/theme-common` (and other core packages) for the plugin.

Both copies end up in the client bundle, each with its own React contexts. A hook from one copy can't read a provider rendered by the other copy, which throws `Hook ... is called outside the <...Provider>`.

## Setup

- `package.json`: Docusaurus `3.10.1-canary-6591` and [`docusaurus-theme-search-typesense@0.27.0`](https://www.npmjs.com/package/docusaurus-theme-search-typesense), which depends on `@docusaurus/theme-common@^3.9.0`, `@docusaurus/plugin-content-docs@^3.9.0` and `@docusaurus/core@^3.9.0`.
- `docusaurus.config.js`: the Typesense search theme, with a placeholder server config (no search request is needed).

## Steps

Requires Node.js >= 24.14.

```bash
npm install
npm ls @docusaurus/theme-common
npm run build
grep -o "is called outside the" build/assets/js/main.*.js | wc -l
```

## Current result

Two copies of `@docusaurus/theme-common` are installed:

```
├─┬ @docusaurus/preset-classic@3.10.1-canary-6591
│ ├─┬ @docusaurus/theme-classic@3.10.1-canary-6591
│ │ └── @docusaurus/theme-common@3.10.1-canary-6591 deduped
│ ├── @docusaurus/theme-common@3.10.1-canary-6591
│ └── ...
└─┬ docusaurus-theme-search-typesense@0.27.0
  ├─┬ @docusaurus/plugin-content-docs@3.10.2
  │ └── @docusaurus/theme-common@3.10.2 deduped
  └── @docusaurus/theme-common@3.10.2
```

In total, `node_modules` has 14 `@docusaurus/*` packages at `3.10.2` next to the 26 canary ones, including a second `@docusaurus/core`.

Both copies are bundled: the `ReactContextError` message (`is called outside the`) appears **2** times in `main.js`.

The build doesn't crash because this plugin wraps its search bar in its own `DocsPreferredVersionContextProvider` (since `0.24.0`), a plugin-side workaround for this duplication.

## Expected result

A single `@docusaurus/theme-common@3.10.1-canary-6591`, and `1` occurrence in `main.js`.

## Contrast: stable `3.10.2`

Replace `3.10.1-canary-6591` by `3.10.2` in `package.json`, then:

```bash
rm -rf node_modules package-lock.json build
npm install
npm ls @docusaurus/theme-common
```

The plugin's `@docusaurus/theme-common` is `deduped`: a single `3.10.2` copy is installed, and `main.js` contains `1` occurrence.

## Workaround: npm `overrides`

Force the plugin's Docusaurus packages to the canary version in `package.json`:

```json
"overrides": {
  "@docusaurus/core": "$@docusaurus/core",
  "@docusaurus/logger": "3.10.1-canary-6591",
  "@docusaurus/plugin-content-docs": "3.10.1-canary-6591",
  "@docusaurus/theme-common": "3.10.1-canary-6591",
  "@docusaurus/theme-translations": "3.10.1-canary-6591",
  "@docusaurus/utils": "3.10.1-canary-6591",
  "@docusaurus/utils-validation": "3.10.1-canary-6591"
}
```

After `rm -rf node_modules package-lock.json && npm install`, all `@docusaurus/*` packages are `3.10.1-canary-6591`, and `main.js` contains `1` occurrence.

## Versions

- `@docusaurus/core` / `@docusaurus/preset-classic`: `3.10.1-canary-6591` (contrast: `3.10.2`)
- `docusaurus-theme-search-typesense`: `0.27.0`
- Node.js `26.8.1`, npm `11.19.0`
