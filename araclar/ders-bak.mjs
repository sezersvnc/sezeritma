import { chromium } from 'playwright';
const [cikti, bolum, adim] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4] ?? 1)];
const yildizlar = {};
for (let i = 1; i < bolum; i++) yildizlar[i] = 3;
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate((y) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({ yildizlar: y, kodlar: {}, gorulenDersler: [], karsilamaGorundu: true })), yildizlar);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
for (let i = 0; i < adim; i++) {
  await sayfa.getByRole('button', { name: /Devam/ }).click();
  await sayfa.waitForTimeout(300);
}
const izle = sayfa.getByRole('button', { name: 'İzle' });
if (await izle.count()) { await izle.click(); await sayfa.waitForTimeout(2200); }
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
