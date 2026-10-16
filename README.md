# Repro: facebook/docusaurus#8226

Issue: https://github.com/facebook/docusaurus/issues/8226

**Result: the bug no longer reproduces with Docusaurus `4.0.0-canary-6972`.**

## The bug

After ejecting `DocSidebarItem/Link` with `--typescript`, `npm run typecheck` failed with `TS2307: Cannot find module '@docusaurus/theme-common/internal'`. Swizzled components import package subpath exports (`package.json` `"exports"`), and the Docusaurus v2 tsconfig (`@tsconfig/docusaurus`) used a `moduleResolution` mode that ignores them.

The `@docusaurus/tsconfig` base config used by the TypeScript template has `"moduleResolution": "bundler"` ([#9258](https://github.com/facebook/docusaurus/pull/9258), Docusaurus 3.0), which resolves subpath exports.

## Setup

- `tsconfig.json`: the TypeScript template config, extending `@docusaurus/tsconfig`.
- `src/theme/`: components ejected with `npm run swizzle @docusaurus/theme-classic <Component> -- --typescript --eject --danger`:
  - `DocSidebarItem/Link` (the one from the issue) imports `@docusaurus/plugin-content-docs/client`.
  - `DocSidebarItem/Category` and `Tabs` import `@docusaurus/theme-common/internal`, the module from the error.
- `src/pages/tabs.tsx`: a page using `@theme/Tabs`, whose props extend a type from `@docusaurus/theme-common/internal` (case reported in the issue comments). A `@ts-expect-error` checks the props are typed, not `any`.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run typecheck
```

## Expected result

`tsc` exits with code 0 and reports no error.

The site also builds and runs: `npm run build && npm run serve`, then open http://localhost:3000/tabs

## Versions

- `@docusaurus/*`: `4.0.0-canary-6972`
- `typescript`: `7.0.2`
- Also verified with Docusaurus `3.10.2` + TypeScript `6.0.3`: no error.
- The same swizzle on Docusaurus `2.1.0` + `@tsconfig/docusaurus@1.0.6` + TypeScript `4.8.4` still prints the error from the issue.
