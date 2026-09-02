import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const cikti = process.argv[2];
const bolumNo = Number(process.argv[3] ?? 12);
const bekle = Number(process.argv[4] ?? 4000);

const CR = String.fromCharCode(13);
const metin = readFileSync(`../src/levels/bolumler/${String(bolumNo).padStart(2, '0')}.md`, 'utf8')
  .split(CR)
  .join('');

const cozum = metin.split('## Cozum\n')[1].split('\n## ')[0].trimEnd();
const ayrac = '--- main ---';
const kod = cozum.includes(ayrac)
  ? {
      fonksiyonlar: cozum.split(ayrac)[0].trimEnd(),
      govde: cozum.split(ayrac)[1].replace(/^\n+/, '').trimEnd(),
    }
  : { govde: cozum, fonksiyonlar: '' };

const yildizlar = {};
for (let i = 1; i < bolumNo; i++) yildizlar[i] = 3;

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 900 } });

const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(
  ([y, k, no]) =>
    localStorage.setItem(
      'sezeritma.ilerleme.v1',
      JSON.stringify({ yildizlar: y, kodlar: { [no]: k } }),
    ),
  [yildizlar, kod, bolumNo],
);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(600);

await sayfa.locator('input[type=range]').fill('5');
await sayfa.getByRole('button', { name: /Çalıştır/ }).click();
await sayfa.waitForTimeout(bekle);
await sayfa.screenshot({ path: cikti });

console.log('bolum', bolumNo, '| konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
