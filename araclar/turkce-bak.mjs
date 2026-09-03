import { chromium } from 'playwright';

const cikti = process.argv[2];
const kod = {
  govde: [
    'int sayac = 0;',
    'while (!molaOdasindaMiyim()) {',
    '  if (ustumdeCikolataVar()) {',
    '    kap();',
    '    sayac++;',
    '  } else {',
    '    ilerle();',
    '  }',
    '}',
  ].join(String.fromCharCode(10)),
  fonksiyonlar: '',
};

const yildizlar = {};
for (let i = 1; i < 13; i++) yildizlar[i] = 3;

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(
  ([y, k]) =>
    localStorage.setItem(
      'sezeritma.ilerleme.v1',
      JSON.stringify({ yildizlar: y, kodlar: { 13: k }, gorulenDersler: [1, 5, 9, 13] }),
    ),
  [yildizlar, kod],
);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
await sayfa.getByRole('button', { name: /Türkçe oku/i }).click();
await sayfa.waitForTimeout(400);
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
