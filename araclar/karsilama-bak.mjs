import { chromium } from 'playwright';
const [cikti, adim] = [process.argv[2], Number(process.argv[3] ?? 0)];
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(() => localStorage.clear());
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
for (let i = 0; i < adim; i++) {
  await sayfa.getByRole('button', { name: /Devam/ }).click();
  await sayfa.waitForTimeout(300);
}
if (adim === 2) {
  await sayfa.getByRole('button', { name: 'İzle' }).click();
  await sayfa.waitForTimeout(1700);
}
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
