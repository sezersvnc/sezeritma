import { chromium } from 'playwright';

const cikti = process.argv[2];
const yildizlar = {};
for (let i = 1; i <= 13; i++) yildizlar[i] = 3;

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 900 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(
  (y) =>
    localStorage.setItem(
      'sezeritma.ilerleme.v1',
      JSON.stringify({ yildizlar: y, kodlar: {}, gorulenDersler: [1, 5, 9, 13, 14] }),
    ),
  yildizlar,
);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
await sayfa.getByRole('button', { name: 'KAVRAMLAR' }).click();
await sayfa.waitForTimeout(400);
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
