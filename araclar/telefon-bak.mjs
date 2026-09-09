import { chromium, devices } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
for (const [ad, cihaz] of [['iphone', devices['iPhone 13']], ['pixel', devices['Pixel 5']]]) {
  const c = await t.newContext({ ...cihaz });
  const s = await c.newPage();
  const y = {}; for (let i = 1; i < 8; i++) y[i] = 3;
  await s.goto('http://localhost:5177/');
  await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
    yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), y);
  await s.reload({ waitUntil: 'networkidle' });
  await s.waitForTimeout(600);
  await s.screenshot({ path: `${SP}/tel-${ad}.png`, fullPage: true });
  console.log(ad, JSON.stringify(await s.evaluate(() => ({
    yatayTasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    genislik: window.innerWidth,
  }))));
  await c.close();
}
await t.close();
