# Repro: facebook/docusaurus#8623

Issue: https://github.com/facebook/docusaurus/issues/8623

**Result: the bug no longer reproduces with Docusaurus `3.10.2` and `docusaurus-theme-search-typesense@0.27.0`.**

## The bug

With Docusaurus `2.3.0`, `docusaurus build` crashed while rendering `/search`, with `TypeError: Cannot read properties of undefined (reading 'searchPagePath')`.

The prerelease `docusaurus-theme-search-typesense@0.9.0-0` imported `useSearchPage()` from `@docusaurus/theme-common/internal`. In Docusaurus `2.3.0` ([#8539](https://github.com/facebook/docusaurus/pull/8539)), this internal hook started reading `themeConfig.algolia.searchPagePath`, which is undefined on a Typesense site.

The theme fixed it in `0.9.0` by copying the hook instead of importing it. Docusaurus v4 also moved these search hooks out of `@docusaurus/theme-common`, into `@docusaurus/theme-search-algolia/client` ([#12108](https://github.com/facebook/docusaurus/pull/12108)).

## Setup

- `docusaurus.config.js`: the Typesense theme config from the issue, with a placeholder server. No Typesense server is needed to build.
- `docs/intro.md`: a single doc served at `/`.

## Steps

Requires Node.js >= 20.

```bash
npm install
npm run build
npm run serve
```

## Expected result

The build succeeds and generates `build/search/index.html`.

At http://localhost:3000/search?q=hello the search page shows "Search results for "hello"". The search requests fail with `ERR_CONNECTION_REFUSED` because there is no Typesense server.

## Seeing the original bug

Install the versions from the issue. Docusaurus `2.3.0` doesn't load with recent webpack versions, so webpack is pinned to `5.75.0`:

```bash
rm -rf node_modules package-lock.json build .docusaurus
npm pkg set overrides.webpack=5.75.0
npm install --legacy-peer-deps --save-exact @docusaurus/core@2.3.0 @docusaurus/preset-classic@2.3.0 @mdx-js/react@1.6.22 react@17.0.2 react-dom@17.0.2 docusaurus-theme-search-typesense@0.9.0-0
npm run build
```

The build fails with:

```
[ERROR] Docusaurus server-side rendering could not render static page with path /search.
TypeError: Cannot read properties of undefined (reading 'searchPagePath')
```

With the same setup, `npm install --legacy-peer-deps --save-exact docusaurus-theme-search-typesense@0.9.0` makes the build pass.

## Docusaurus v4

The site also builds with Docusaurus `4.0.0-canary-6974`:

```bash
npm install --save-exact @docusaurus/core@4.0.0-canary-6974 @docusaurus/preset-classic@4.0.0-canary-6974
npm run build
```

The theme only supports Docusaurus `>=3.9.0 <4.0.0`, so npm warns about its peer dependencies and installs a second, `3.10.2` copy of some `@docusaurus/*` packages for the theme. That duplication is tracked in [#7728](https://github.com/facebook/docusaurus/issues/7728). Docusaurus v4 requires Node.js >= 24.21.

## Versions

- `@docusaurus/core` / `@docusaurus/preset-classic`: `3.10.2` (also tested: `4.0.0-canary-6974`; original bug: `2.3.0`)
- `docusaurus-theme-search-typesense`: `0.27.0` (original bug: `0.9.0-0`)
- Node.js `26.8.1`, npm `11.19.0`
