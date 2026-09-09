import { chromium } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const h = []; s.on('pageerror', e => h.push(String(e)));
// hic ders gorulmemis, 6. bolumde: ders kendiliginden acilmali
const y = {}; for (let i = 1; i < 6; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: {}, gorulenDersler: [], karsilamaGorundu: true })), y);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(600);
console.log('1) ders kendiliginden acildi:', await s.evaluate(() => !!document.querySelector('.orti')));
await s.getByRole('button', { name: 'Anlatımı kapat' }).click();
await s.waitForTimeout(300);
console.log('2) kapandi:', await s.evaluate(() => !document.querySelector('.orti')));
// sonraki bolume gec: bir daha acilmamali
await s.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  ...JSON.parse(localStorage.getItem('sezeritma.ilerleme.v1')), yildizlar: { 1:3,2:3,3:3,4:3,5:3,6:3 } })));
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(600);
console.log('3) yeni bolumde acilmadi:', await s.evaluate(() => !document.querySelector('.orti')));
console.log('   ayar kayitli:', await s.evaluate(() => JSON.parse(localStorage.getItem('sezeritma.ilerleme.v1')).dersOtomatik));
// elle acilabiliyor mu
await s.getByRole('button', { name: /anlatımı aç/i }).click();
await s.waitForTimeout(400);
console.log('4) elle acilabiliyor:', await s.evaluate(() => !!document.querySelector('.orti')));
await s.keyboard.press('Escape');
// kavramlardan geri ac
await s.getByRole('button', { name: 'Kavramlar' }).click();
await s.waitForTimeout(400);
await s.screenshot({ path: `${SP}/anahtar.png` });
await s.locator('.anahtar input').check();
await s.waitForTimeout(300);
console.log('5) geri acildi:', await s.evaluate(() => JSON.parse(localStorage.getItem('sezeritma.ilerleme.v1')).dersOtomatik));
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
