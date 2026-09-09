import { chromium } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const y = {}; for (let i = 1; i < 20; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), y);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(500);
// bos kodla uc kere calistir + iki ipucu ac
for (let i = 0; i < 3; i++) { await s.getByRole('button', { name: /Çalıştır|Devam et/ }).first().click(); await s.waitForTimeout(500); await s.getByRole('button', { name: 'Sıfırla' }).click(); await s.waitForTimeout(200); }
await s.getByRole('button', { name: /İpucu ver/ }).click(); await s.waitForTimeout(200);
await s.getByRole('button', { name: /Hâlâ takıldım/ }).click(); await s.waitForTimeout(300);
const varMi = await s.evaluate(() => [...document.querySelectorAll('button')].some(b => b.textContent.includes('Çözümü göster')));
console.log('cozum dugmesi:', varMi);
if (varMi) {
  await s.getByRole('button', { name: /Çözümü göster/ }).click();
  await s.waitForTimeout(400);
  await s.screenshot({ path: `${SP}/cozum.png` });
  await s.getByRole('button', { name: /Çalıştır/ }).first().click();
  for (let k = 0; k < 60; k++) { if (await s.evaluate(() => !!document.querySelector('.orti'))) break; await s.waitForTimeout(300); }
  await s.waitForTimeout(400);
  console.log('yildiz:', await s.evaluate(() => document.querySelectorAll('.orti .yildiz-dolu, .orti .yildizlar span').length || document.querySelector('.orti')?.textContent?.match(/★+/)?.[0]?.length));
  await s.screenshot({ path: `${SP}/cozum-basari.png` });
}
await t.close();
