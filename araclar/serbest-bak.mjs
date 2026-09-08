import { chromium } from 'playwright';
const cikti = process.argv[2];
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/#serbest', { waitUntil: 'networkidle' });
await sayfa.evaluate(() => localStorage.removeItem('sezeritma.serbest.v1'));
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);

await sayfa.getByRole('button', { name: 'Palet' }).click();
for (const [x, y] of [[3, 1], [3, 2], [5, 4], [5, 5]]) {
  await sayfa.getByRole('button', { name: `${x}. sütun, ${y}. satır` }).click();
}
await sayfa.getByRole('button', { name: 'Çikolata' }).click();
await sayfa.getByRole('button', { name: '2. sütun, 5. satır' }).click();
await sayfa.waitForTimeout(300);
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
