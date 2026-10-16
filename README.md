# Repro: facebook/docusaurus#8860

Issue: https://github.com/facebook/docusaurus/issues/8860

**Result: the bug no longer reproduces with Docusaurus `4.0.0-canary-6975`.**

## The bug

With Docusaurus `2.4.0`, the production CSS minifier (cssnano's `reduceIdents`) renamed the `grid-column: kw` references to `grid-column: c`, but kept the `[kw]` line names in `grid-template-columns`. The grid cells lost their named columns and the layout broke, only in production builds.

cssnano fixed it in `postcss-reduce-idents@6.0.1` ([cssnano#1491](https://github.com/cssnano/cssnano/pull/1491)), used since Docusaurus `3.3.0` ([#10092](https://github.com/facebook/docusaurus/pull/10092)). Docusaurus v4 doesn't use cssnano anymore: it minifies CSS with Lightning CSS ([#12604](https://github.com/facebook/docusaurus/pull/12604)), which keeps the grid line names.

## Setup

- `src/components/TableGrid/styles.module.css`: the CSS from the issue, in a CSS module.
- `src/components/TableGrid/index.js`: a grid with the 3 named cells. After hydration, it checks that the cells are on the same row, in column order, and prints the result with the computed `grid-column` values.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

Open http://localhost:3000/

## Expected result

The page shows `14 Mo Description` on one row, and:

```
Layout OK (grid-column: kw, day, description)
```

The built CSS keeps the names:

```bash
grep -o '\.grid_[^}]*}' build/assets/css/*.css
```

```
.grid_zSxG{grid-template-columns:[kw]2.5em[day]3em[description]10em;display:grid}
.grid_zSxG>.kw_VlEk{grid-column:kw}
.grid_zSxG>.day_ITo0{grid-column:day}
.grid_zSxG>.description_pJxa{grid-column:description}
```

The same output is generated with the deprecated `webpack: true` mode (with `@swc/core` installed), which also minifies CSS with Lightning CSS.

## Seeing the original bug

Install the version from the issue. Docusaurus `2.4.0` doesn't load with recent webpack versions, and doesn't support ESM config files:

```bash
rm -rf node_modules package-lock.json build .docusaurus
npm pkg set overrides.webpack=5.75.0
npm install --legacy-peer-deps --save-exact @docusaurus/core@2.4.0 @docusaurus/preset-classic@2.4.0 @mdx-js/react@1.6.22 react@17.0.2 react-dom@17.0.2
sed -i.bak 's/^export default/module.exports =/' docusaurus.config.js
npm run build
npm run serve
```

The cells are stacked vertically, outside of the 3 named columns, and the page shows:

```
Layout BROKEN (grid-column: c, d, e)
```

The built CSS has mismatching names:

```
.grid_zSxG{display:grid;grid-template-columns:[kw] 2.5em [day] 3em [description] 10em}
.grid_zSxG>.kw_VlEk{grid-column:c}
.grid_zSxG>.day_ITo0{grid-column:d}
.grid_zSxG>.description_pJxa{grid-column:e}
```

With Docusaurus `3.10.2`, cssnano still renames the names, but consistently (`[c] 2.5em [d] 3em [e] 10em`), and the page shows `Layout OK (grid-column: c, d, e)`.

## Versions

- `@docusaurus/core` / `@docusaurus/preset-classic`: `4.0.0-canary-6975` (also tested: `3.10.2`; original bug: `2.4.0`)
- Node.js `26.8.1`, npm `11.19.0`
