// Prints the computed styles of the homepage elements from the issue screenshots.
// Usage: node scripts/computed-styles.mjs http://localhost:3000/ > dev.json
import {chromium} from 'playwright-core';

const url = process.argv[2] ?? 'http://localhost:3000/';

const selectors = {
  navbar: '.navbar',
  navbarTitle: '.navbar__title',
  navbarLink: '.navbar__item.navbar__link',
  heroTitle: 'header h1',
  heroSubtitle: 'header p',
  heroButton: 'header a.button',
  featureImage: 'main svg',
  featureHeading: 'main h3',
  featureText: 'main p',
  footerTitle: '.footer__title',
  footerLink: '.footer__link-item',
  copyright: '.footer__copyright',
};

const properties = [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'padding',
  'margin',
  'height',
];

function readComputedStyles({selectors, properties}) {
  const result = {};
  for (const [name, selector] of Object.entries(selectors)) {
    const style = getComputedStyle(document.querySelector(selector));
    result[name] = Object.fromEntries(
      properties.map((property) => [property, style.getPropertyValue(property)]),
    );
  }
  return result;
}

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1280, height: 900}});
await page.goto(url, {waitUntil: 'networkidle'});
const styles = await page.evaluate(readComputedStyles, {selectors, properties});
await browser.close();

console.log(JSON.stringify(styles, null, 2));
