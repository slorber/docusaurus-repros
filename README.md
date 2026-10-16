# Repro: facebook/docusaurus#8095

Issue: https://github.com/facebook/docusaurus/issues/8095

**Result: the reported keyboard bug no longer reproduces with Docusaurus `4.0.0-canary-6972`.** The menu still doesn't behave like a modal dialog (focus isn't moved or trapped, no Escape). That part is tracked in [facebook/docusaurus#9457](https://github.com/facebook/docusaurus/issues/9457).

## The bug

On a mobile-width viewport, the hamburger button toggled the menu on `keydown`. Pressing Tab on the focused button opened the menu, and Enter opened it then closed it right away (`keydown` + `click`). [facebook/docusaurus#8207](https://github.com/facebook/docusaurus/pull/8207) (v2.2.0) toggles on `click` only.

Tab also reached the links of the hidden menu panel. That panel is `inert` since [facebook/docusaurus#10705](https://github.com/facebook/docusaurus/pull/10705) (v3.8.0).

## Steps

```bash
npm install
npm run build
npm run serve
```

1. Open http://localhost:3000/docs/intro in a viewport 996px wide or less, like DevTools device mode
2. Press Tab twice: focus is on the hamburger button ("Toggle navigation bar")
3. Press Tab once more, then Shift+Tab to come back to the hamburger button
4. Press Enter (or Space)
5. Press Tab repeatedly
6. Press Enter on "Close navigation bar"

## Expected result

- Step 3: the menu stays closed
- Step 4: the menu opens and stays open, the button has `aria-expanded="true"`
- Step 5: inside the menu, focus goes through the brand link, color mode toggle, "Close navigation bar", "← Back to main menu", Intro, Second, Third. The "Docs" and "Home" links of the hidden main menu panel are skipped.
- Step 6: the menu closes. Enter on a doc link also navigates and closes the menu.

## Not modal yet (facebook/docusaurus#9457)

On `4.0.0-canary-6972`:

- Opening the menu leaves focus on the hamburger button, and the next Tab goes to the navbar brand link hidden behind the menu
- Tab after "Third" moves focus to the page content behind the backdrop, and the menu stays open
- Escape doesn't close the menu
- After closing it with the close button, focus goes to `<body>` instead of the hamburger button

## Seeing the bug on 2.0.1

1. In `package.json`, use `2.0.1` for `@docusaurus/core` and `@docusaurus/preset-classic`, `17.0.2` for `react` and `react-dom`, `1.6.22` for `@mdx-js/react`, and add `"overrides": {"webpack": "5.74.0"}` (recent webpack versions break the 2.0.1 build)
2. In `docusaurus.config.js`, replace `export default` with `module.exports =`
3. `rm -rf node_modules package-lock.json && npm install && npm run build && npm run serve`

With the same steps, Tab on the focused hamburger button opens the menu, Enter opens and closes it right away, and Tab inside the open menu reaches the hidden "Docs" and "Home" links.

## Versions

- `@docusaurus/core` and `@docusaurus/preset-classic` `4.0.0-canary-6972`, React `19.3.1`
- Tested with Node.js 26.8.1 and Chromium at 375x812
