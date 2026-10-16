# Repro: facebook/docusaurus#8952

Issue: https://github.com/facebook/docusaurus/issues/8952

**Result: the cause of the bug is gone with Docusaurus `4.0.0-canary-6975` (DocSearch `4.7.1`). Checked with an automated test that approximates an IME, not with a real Japanese IME on Windows.**

## The bug

On Windows Firefox, typing Japanese (or Chinese Pinyin) in the search modal interrupted the IME: typing `ta` gave `ｔあ` instead of `た`. The search input's `enterkeyhint` attribute switched between `search` and `go` each time search results appeared or disappeared, and Firefox on Windows interrupts the IME when this attribute changes ([Firefox bug 1831015](https://bugzilla.mozilla.org/show_bug.cgi?id=1831015), [algolia/autocomplete#1135](https://github.com/algolia/autocomplete/issues/1135)).

DocSearch v3 got `enterkeyhint` from Autocomplete, which sets `go` when a result is selected. DocSearch v4 always sets `enterkeyhint="search"` in search mode ([source](https://github.com/algolia/docsearch/blob/v4.7.1/packages/docsearch-react/src/SearchBox.tsx#L164)). Docusaurus v4 requires DocSearch v4.

## Setup

- `docusaurus.config.js`: classic preset, with `themeConfig.algolia` using the public search-only DocSearch index of docusaurus.io. A real index is needed: the attribute changed when results showed up mid-composition.
- `scripts/check-ime.mjs`: opens the search modal in headless Firefox, dispatches the composition and input events of a Japanese IME typing `dokyumento` (`ｄ`, `ど`, `どｋ`... `ドキュメント`), and records the `enterkeyhint` changes during the composition. Playwright can't drive a real IME: this is an approximation.

## Steps

Requires Node.js >= 24.21.

```bash
npm install
npm run build
npm run serve
```

### Manual check (Windows, Firefox, Japanese IME)

1. Enable a Japanese IME (Microsoft IME or Google Japanese Input)
2. Open http://localhost:3000/ in Firefox and press Ctrl+K
3. Turn the IME on and slowly type `ta`, then `dokyumento` and press Space to convert

### Automated check

In another terminal, while the site is served:

```bash
npx playwright install firefox
npm run check-ime
```

## Expected result

Manual check: typing `ta` gives `た`, and `dokyumento` converts to `ドキュメント`.

Automated check (Firefox 157, Playwright 1.64.1):

```
composing "ｄ": enterkeyhint=search hits=5 value="ｄ"
composing "ど": enterkeyhint=search hits=0 value="ど"
composing "どｋ": enterkeyhint=search hits=10 value="どｋ"
...
composing "どきゅめんと": enterkeyhint=search hits=0 value="どきゅめんと"
composing "ドキュメント": enterkeyhint=search hits=0 value="ドキュメント"

OK: enterkeyhint never changed while composing
```

## Comparison with DocSearch v3

The same check against a site using Docusaurus `3.10.2` and `@docsearch/react` `3.9.0` (same config and page) fails:

```
composing "ｄ": enterkeyhint=go hits=5 value="ｄ"
composing "ど": enterkeyhint=search hits=0 value="ど"
composing "どｋ": enterkeyhint=go hits=10 value="どｋ"
...
FAIL: enterkeyhint changed 8 times while composing (go -> search -> go -> search -> go -> search -> go -> search)
```

Docusaurus 3.10 also accepts DocSearch v4 (`@docsearch/react: ^3.9.0 || ^4.3.2`): Docusaurus v3 sites still on DocSearch v3 can upgrade `@docsearch/react` to v4.

## Remaining upstream behavior

DocSearch v4 still sends a search request for each intermediate composition string, so results update while composing (`hits` above). Autocomplete has an `ignoreCompositionEvents` option for that, which DocSearch doesn't expose: [algolia/docsearch#1043](https://github.com/algolia/docsearch/issues/1043).
