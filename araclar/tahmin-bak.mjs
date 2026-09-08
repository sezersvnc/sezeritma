import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const [cikti, bolum] = [process.argv[2], Number(process.argv[3] ?? 13)];
const CR = String.fromCharCode(13);
const metin = readFileSync(`src/levels/bolumler/${String(bolum).padStart(2, '0')}.md`, 'utf8').split(CR).join('');
const cozum = metin.split('## Cozum\n')[1].split('\n## ')[0].trimEnd();
const yildizlar = {};
for (let i = 1; i < bolum; i++) yildizlar[i] = 3;

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 1000 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(([y, k, no]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({ yildizlar: y, kodlar: { [no]: { govde: k, fonksiyonlar: '' } }, gorulenDersler: [1,2,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,27,28,29,30,31], karsilamaGorundu: true })), [yildizlar, cozum, bolum]);
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
await sayfa.getByRole('button', { name: 'Hata verir' }).click();
await sayfa.waitForTimeout(200);
await sayfa.locator('input[type=range]').fill('5');
await sayfa.getByRole('button', { name: /Çalıştır/ }).click();
await sayfa.waitForTimeout(3500);
const tebrik = sayfa.getByRole('button', { name: /DAHA KISA YAZ/i });
if (await tebrik.count()) { await tebrik.click(); await sayfa.waitForTimeout(400); }
await sayfa.screenshot({ path: cikti });
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
