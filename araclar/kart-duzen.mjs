import { chromium } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const h = []; s.on('pageerror', e => h.push(String(e))); s.on('console', m => m.type()==='error' && h.push(m.text()));
const y = {}; for (let i = 1; i < 5; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true, dersOtomatik: false })), y);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(500);
const oku = () => s.evaluate(() => [...document.querySelectorAll('.kart-satirlari code')].map(c => c.textContent));
for (const ad of ['ilerle', 'sagaDon', 'ilerle', 'kap']) await s.getByRole('button', { name: new RegExp('^' + ad) }).first().click();
console.log('1) eklendi:', JSON.stringify(await oku()));
// ortadaki satiri sil
await s.getByRole('button', { name: '2. satırı sil' }).click();
await s.waitForTimeout(200);
console.log('2) 2. satir silindi:', JSON.stringify(await oku()));
// 1. satiri sec, altina ekle
await s.locator('.kart-satir-sec').first().click();
await s.getByRole('button', { name: /^sagaDon/ }).first().click();
await s.waitForTimeout(200);
console.log('3) araya eklendi:', JSON.stringify(await oku()));
console.log('   secim ilerledi mi, bir daha ekle:');
await s.getByRole('button', { name: /^solaDon/ }).first().click();
await s.waitForTimeout(200);
console.log('4)', JSON.stringify(await oku()));
console.log('   editordeki kod:', JSON.stringify(await s.evaluate(() => document.querySelectorAll('.cm-content')[0].textContent)));
await s.screenshot({ path: `${SP}/kart-duzen.png` });
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
