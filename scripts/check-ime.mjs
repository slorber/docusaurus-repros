// Approximates a Japanese IME session in the DocSearch input, in headless
// Firefox, and reports whether the input's `enterkeyhint` attribute changes
// while composing. Changing that attribute mid-composition makes Firefox on
// Windows interrupt the IME: https://bugzilla.mozilla.org/show_bug.cgi?id=1831015
//
// Playwright can't drive a real IME: this dispatches the composition and input
// events an IME would, it doesn't reproduce the Windows IME itself.
//
// Usage: node scripts/check-ime.mjs [siteUrl]

import {firefox} from 'playwright';

const siteUrl = process.argv[2] ?? 'http://localhost:3000/';

// Typing "dokyumento" with a romaji IME, then converting to katakana
// Some intermediate strings have search results (ｄ, どｋ), some don't (ど)
const compositionSteps = [
  'ｄ',
  'ど',
  'どｋ',
  'どｋｙ',
  'どきゅ',
  'どきゅｍ',
  'どきゅめ',
  'どきゅめｎ',
  'どきゅめんｔ',
  'どきゅめんと',
  'ドキュメント',
];

const browser = await firefox.launch();
const page = await browser.newPage();
await page.goto(siteUrl);
await page.click('.DocSearch-Button');
await page.locator('.DocSearch-Input').waitFor();

await page.evaluate(() => {
  const input = document.querySelector('.DocSearch-Input');
  window.composing = false;
  window.enterKeyHintChangesWhileComposing = [];
  new MutationObserver(() => {
    if (window.composing) {
      window.enterKeyHintChangesWhileComposing.push(
        input.getAttribute('enterkeyhint'),
      );
    }
  }).observe(input, {attributes: true, attributeFilter: ['enterkeyhint']});
});

function dispatchCompositionEvent(type, data) {
  return page.evaluate(
    ({type, data}) => {
      const input = document.querySelector('.DocSearch-Input');
      if (type === 'compositionstart') {
        window.composing = true;
      }
      if (type === 'compositionend') {
        window.composing = false;
      }
      input.dispatchEvent(new CompositionEvent(type, {bubbles: true, data}));
    },
    {type, data},
  );
}

function dispatchInputEvent(value, isComposing) {
  return page.evaluate(
    ({value, isComposing}) => {
      const input = document.querySelector('.DocSearch-Input');
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      ).set;
      valueSetter.call(input, value);
      input.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          data: value,
          inputType: 'insertCompositionText',
          isComposing,
        }),
      );
    },
    {value, isComposing},
  );
}

function readInputState() {
  return page.evaluate(() => {
    const input = document.querySelector('.DocSearch-Input');
    return {
      value: input.value,
      enterKeyHint: input.getAttribute('enterkeyhint'),
      hits: document.querySelectorAll('.DocSearch-Hit').length,
    };
  });
}

await page.locator('.DocSearch-Input').focus();
await dispatchCompositionEvent('compositionstart', '');

for (const step of compositionSteps) {
  await dispatchCompositionEvent('compositionupdate', step);
  await dispatchInputEvent(step, true);
  // Let the search request resolve, as when the user pauses while typing
  await page.waitForTimeout(800);
  const state = await readInputState();
  console.log(
    `composing "${step}": enterkeyhint=${state.enterKeyHint} hits=${state.hits} value="${state.value}"`,
  );
}

const committedText = compositionSteps.at(-1);
await dispatchCompositionEvent('compositionend', committedText);
await dispatchInputEvent(committedText, false);

const changes = await page.evaluate(
  () => window.enterKeyHintChangesWhileComposing,
);
await browser.close();

console.log();
if (changes.length > 0) {
  console.log(
    `FAIL: enterkeyhint changed ${changes.length} times while composing (${changes.join(' -> ')})`,
  );
  console.log('Firefox on Windows interrupts the IME on each change');
  process.exitCode = 1;
} else {
  console.log('OK: enterkeyhint never changed while composing');
}
