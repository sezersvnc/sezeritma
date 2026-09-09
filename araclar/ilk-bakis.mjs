import { chromium } from 'playwright';
const SP = process.argv[2];
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1366, height: 900 } });
const hatalar = [];
sayfa.on('pageerror', (e) => hatalar.push(String(e)));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(() => localStorage.clear());
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(600);
await sayfa.screenshot({ path: `${SP}/y1-karsilama.png` });
for (let i = 0; i < 4; i++) { await sayfa.getByRole('button', { name: 'Devam', exact: true }).click(); await sayfa.waitForTimeout(250); }
await sayfa.getByRole('button', { name: 'Başla' }).click();
await sayfa.waitForTimeout(400);
await sayfa.screenshot({ path: `${SP}/y2-ilk-ders.png` });
// dersi bitir, bolume gir
for (let i = 0; i < 6; i++) {
  const d = sayfa.getByRole('button', { name: 'Devam', exact: true });
  if (await d.count()) { await d.click(); await sayfa.waitForTimeout(250); } else break;
}
const bas = sayfa.getByRole('button', { name: 'Bölüme başla' });
if (await bas.count()) { await bas.click(); await sayfa.waitForTimeout(400); }
await sayfa.screenshot({ path: `${SP}/y3-bolum1.png` });
console.log('hatalar:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
