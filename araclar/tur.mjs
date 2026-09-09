import { chromium } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const hatalar = [];
const yeni = async (b, temiz = false) => {
  const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
  s.on('pageerror', (e) => hatalar.push(String(e)));
  s.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
  await s.goto('http://localhost:5177/');
  if (temiz) await s.evaluate(() => localStorage.clear());
  else {
    const y = {}; for (let i = 1; i < b; i++) y[i] = 3;
    await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
      yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length: 33}, (_, i) => i), karsilamaGorundu: true })), y);
  }
  await s.reload({ waitUntil: 'networkidle' });
  await s.waitForTimeout(600);
  return s;
};

// 1. ilk acilis (karsilama)
let s = await yeni(1, true);
await s.screenshot({ path: `${SP}/t1-karsilama.png` });
for (let i = 0; i < 4; i++) { await s.getByRole('button', { name: /Devam|İleri|→/ }).first().click().catch(()=>{}); await s.waitForTimeout(350); }
await s.screenshot({ path: `${SP}/t2-karsilama-son.png` });
await s.close();

// 2. bolum 1 ders karti
s = await yeni(1);
await s.getByRole('button', { name: /anlatımı aç/i }).click();
await s.waitForTimeout(500);
await s.screenshot({ path: `${SP}/t3-ders.png` });
await s.keyboard.press('ArrowRight'); await s.waitForTimeout(500);
await s.screenshot({ path: `${SP}/t4-ders-demo.png` });
await s.close();

// 5. kavramlar
s = await yeni(20);
await s.getByRole('button', { name: 'Kavramlar' }).click();
await s.waitForTimeout(500);
await s.screenshot({ path: `${SP}/t5-kavramlar.png` });
await s.keyboard.press('Escape');
await s.getByRole('button', { name: 'Vardiya çizelgesi' }).click();
await s.waitForTimeout(500);
await s.screenshot({ path: `${SP}/t6-harita.png` });
await s.close();

// 6. bolum 30 (ozyineleme) - en karmasik ekran
s = await yeni(30);
await s.screenshot({ path: `${SP}/t7-bolum30.png` });
await s.close();
console.log('hatalar:', hatalar.length ? hatalar : 'yok');
await t.close();
