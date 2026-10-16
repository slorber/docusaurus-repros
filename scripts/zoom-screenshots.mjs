// Screenshots the homepage like the two windows of the issue, on a Windows
// display scaled to 125% (devicePixelRatio 1.25):
// - "Edge": browser zoom 100%
// - "Chrome": browser zoom 67%, so devicePixelRatio 1.25 * 2/3
// Usage: node scripts/zoom-screenshots.mjs http://localhost:3000/
import {chromium} from 'playwright-core';

const url = process.argv[2] ?? 'http://localhost:3000/';

// Window sizes in physical pixels, taken from the issue screenshots
const windows = [
  {name: 'edge-zoom-100', width: 1840, height: 867, zoom: 1},
  {name: 'chrome-zoom-67', width: 1913, height: 861, zoom: 2 / 3},
];
const displayScale = 1.25;

const browser = await chromium.launch();
for (const browserWindow of windows) {
  const devicePixelRatio = displayScale * browserWindow.zoom;
  const page = await browser.newPage({
    viewport: {
      width: Math.round(browserWindow.width / devicePixelRatio),
      height: Math.round(browserWindow.height / devicePixelRatio),
    },
    deviceScaleFactor: devicePixelRatio,
  });
  await page.goto(url, {waitUntil: 'networkidle'});
  const heroHeight = await page.evaluate(
    () => document.querySelector('header').getBoundingClientRect().height,
  );
  const path = `screenshots/${browserWindow.name}.png`;
  await page.screenshot({path});
  console.log(
    `${path}: hero banner ${heroHeight}px in CSS, ${(heroHeight * devicePixelRatio).toFixed(1)}px on screen`,
  );
  await page.close();
}
await browser.close();
