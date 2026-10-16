# Repro: facebook/docusaurus#8357

Issue: https://github.com/facebook/docusaurus/issues/8357

**Result: the bug no longer reproduces with Docusaurus `4.0.0-canary-6972` (Mermaid `12.2.0`).**

## The bug

With Docusaurus 2.2.0 (Mermaid 9.x), a Mermaid flowchart in the second tab of `<Tabs>` had no arrowheads. Every diagram used the same marker ids (`flowchart-pointEnd`…), so `marker-end="url(#flowchart-pointEnd)"` in the second diagram resolved to the marker of the first diagram, inside the hidden first tab.

Mermaid 10.5.0 gives markers unique ids per diagram ([mermaid-js/mermaid#4825](https://github.com/mermaid-js/mermaid/pull/4825)), for example `_r_1_-0_flowchart-v2-pointEnd-margin`.

## Setup

`src/pages/index.mdx` contains the code from the issue: two Mermaid flowcharts with arrows, one in each tab.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

Open http://localhost:3000/ and click `tab-b`.

## Expected result

The `tab-b` diagram shows its 2 arrowheads pointing to `42`, like the `tab-a` diagram.

To check the marker ids, run this in the browser console. Each diagram must only reference its own markers (`resolvesInsideSameSvg: true`):

```js
[...document.querySelectorAll('.docusaurus-mermaid-container svg')].map((svg) => {
  const url = svg.querySelector('[marker-end]').getAttribute('marker-end');
  const id = url.slice(5, -1);
  return {url, resolvesInsideSameSvg: svg.contains(document.getElementById(id))};
});
```

With Docusaurus 2.2.0 (Mermaid 9.4.3), both diagrams reference `url(#flowchart-pointEnd)`, the `tab-b` reference resolves to the `tab-a` marker (`resolvesInsideSameSvg: false`), and the `tab-b` arrowheads are missing.
