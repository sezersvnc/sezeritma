import { chromium } from 'playwright';

const cikti = process.argv[2];
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(() => localStorage.clear());
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
await sayfa.getByRole('button', { name: 'BÖLÜME BAŞLA' }).click();
await sayfa.waitForTimeout(300);
await sayfa.getByRole('button', { name: /^ilerle\(\);/ }).click();
await sayfa.waitForTimeout(200);
await sayfa.getByRole('button', { name: /^ilerle\(\);/ }).click();
await sayfa.waitForTimeout(400);
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
