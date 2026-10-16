# Repro: facebook/docusaurus#7918

Issue: https://github.com/facebook/docusaurus/issues/7918

**Result: the content shift still happens with Docusaurus `4.0.0-canary-6972`, on purpose. The CSS workaround in `src/css/custom.css` removes it.**

## The bug

On a long doc with a hideable sidebar, scroll to the bottom, then collapse and expand the sidebar: the page no longer shows the bottom, but a section thousands of pixels higher.

This is by design. When the sidebar is hidden, the doc content gets the freed space: lines re-wrap and the page gets shorter, so the browser clamps the scroll position. Expanding the sidebar makes the page taller again, but the scroll position stays where it was clamped.

## Setup

- `docusaurus.config.js`: `themeConfig.docs.sidebar.hideable: true`, and a commented-out `customCss` line that applies the workaround.
- `docs/long-doc.md`: 40 sections of wrapping paragraphs, served at `/`.
- `src/css/custom.css`: the workaround.
- `package.json`: the Browserslist config of the `create-docusaurus` template. Without one, `postcss-preset-env` polyfills the CSS cascade layers of the theme with higher-specificity selectors, and the workaround selector is not specific enough to win.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

1. Open http://localhost:3000/ in a window at least 997px wide (1280px below)
2. Scroll to the bottom of the doc
3. Collapse the sidebar with the double arrow button at the bottom of the sidebar
4. Expand it again with the arrow bar that replaced the sidebar

## Expected result

You are no longer at the bottom of the page. Measured in Chrome with a 1280px wide viewport:

| | Sidebar visible | Sidebar hidden | Sidebar visible again |
| --- | --- | --- | --- |
| Content container width | 965px | 1235px | 965px |
| Page height | 22269px | 18732px | 22269px |
| Scroll position | bottom | bottom (clamped) | 3537px above the bottom, at "Section 34" |

With a 1920px wide viewport, the content container goes from 1320px to 1440px, and you end up 871px above the bottom.

## Workaround

The workaround keeps the doc content exactly as wide as with the sidebar visible:

1. Uncomment the `customCss` line in `docusaurus.config.js`
2. `npm run build` and `npm run serve`, then repeat the steps

The content container keeps its width (965px with a 1280px viewport, 1320px with a 1920px viewport), the page height doesn't change, and you stay at the bottom. The content moves 135px to the left, centered in the space the sidebar freed.

```css
@media (width >= 997px) {
  [class*='docSidebarContainerHidden'] + main {
    max-width: min(
      calc(100% - var(--doc-sidebar-width)),
      var(--ifm-container-width-xl)
    );
    margin-inline: auto;
  }
}
```

CSS module class names are hashed (`docSidebarContainerHidden_DPk8`), so the selector matches their stable prefix.

## Versions

- `@docusaurus/core` and `@docusaurus/preset-classic` `4.0.0-canary-6972` (Rspack and SWC by default)
- React 19.3.1
- Node.js 26.8.1
- Chrome
