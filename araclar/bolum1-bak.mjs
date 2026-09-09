import { chromium } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
await s.goto('http://localhost:5177/');
await s.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: {}, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })));
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(600);
await s.screenshot({ path: `${SP}/son-bolum1.png` });
// karti bas, calistir
await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.waitForTimeout(200);
await s.getByRole('button', { name: /Çalıştır/ }).click();
for (let k = 0; k < 40; k++) { if (await s.evaluate(() => !!document.querySelector('.orti'))) break; await s.waitForTimeout(250); }
await s.evaluate(() => document.querySelector('.orti')?.remove());
await s.waitForTimeout(200);
await s.screenshot({ path: `${SP}/son-bolum1-calisti.png` });
await t.close();
