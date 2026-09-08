import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [cikti, sayfa2] = [process.argv[2], process.argv[3] === '2'];
const CR = String.fromCharCode(13);
const metin = readFileSync('src/levels/bolumler/32.md', 'utf8').split(CR).join('');
const cozum = metin.split('## Cozum\n')[1].split('\n## ')[0].trimEnd();
const yildizlar = {};
for (let i = 1; i <= 31; i++) yildizlar[i] = 3;

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 1000 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(([y, k]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({ yildizlar: y, kodlar: { 32: { govde: k, fonksiyonlar: '' } }, gorulenDersler: Array.from({length: 32}, (_, i) => i + 1), karsilamaGorundu: true, tahminKapali: true })), [yildizlar, cozum]);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
await sayfa.locator('input[type=range]').fill('5');
await sayfa.getByRole('button', { name: /Çalıştır/ }).click();
await sayfa.waitForTimeout(26000);
await sayfa.getByRole('button', { name: 'Vardiyayı bitir' }).click();
await sayfa.waitForTimeout(400);
if (sayfa2) { await sayfa.getByRole('button', { name: 'Devam', exact: true }).click(); await sayfa.waitForTimeout(400); }
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
