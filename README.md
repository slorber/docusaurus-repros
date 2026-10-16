# Repro: facebook/docusaurus#8485

Issue: https://github.com/facebook/docusaurus/issues/8485

**Result: the bug no longer reproduces with Docusaurus `4.0.0-canary-6974`.**

## The bug

With Docusaurus 2.2.0, below the 997px breakpoint, the mobile navbar sidebar rendered a navbar `type: 'dropdown'` item without `to` as an `<a role="button">` with no `href`. Hovering its label showed the text cursor (computed `cursor: auto`) instead of the pointer.

The mobile dropdown label now has an explicit `cursor: pointer` ([#9398](https://github.com/facebook/docusaurus/pull/9398), released in 3.2.0), and `href="#"` when it has no `to` ([#10898](https://github.com/facebook/docusaurus/pull/10898), released in 3.8.0).

## Setup

`docusaurus.config.js` has 2 navbar dropdowns:

- `Dropdown`: the config from the issue, without `to`
- `Dropdown with to`: with a `to` link, and an internal and an external item

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

Open http://localhost:3000/ in a window narrower than 997px, open the navbar sidebar (hamburger button), expand both dropdowns, and hover their labels and items.

## Expected result

The pointer cursor on every dropdown label and item.

To check, run this in the browser console while the sidebar is open:

```js
[...document.querySelectorAll('.navbar-sidebar .menu__link')].map((el) => ({
  text: el.textContent,
  href: el.getAttribute('href'),
  cursor: getComputedStyle(el).cursor,
}));
```

With `4.0.0-canary-6974`, every entry has `cursor: 'pointer'`, and the `Dropdown` label has `href: '#'`.

With Docusaurus 2.2.0 (the latest version when the issue was opened), the `Dropdown` label has `href: null` and `cursor: 'auto'`, so the browser shows the text cursor over its label. The `Dropdown with to` label and all items already had `cursor: 'pointer'`.

On desktop widths, with `4.0.0-canary-6974`, the navbar dropdown labels and items also have `cursor: 'pointer'`.
