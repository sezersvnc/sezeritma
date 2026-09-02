import { chromium } from 'playwright';

const cikti = process.argv[2] ?? 'ekran.png';
const genislik = Number(process.argv[3] ?? 1440);
const yukseklik = Number(process.argv[4] ?? 900);

const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: genislik, height: yukseklik } });

const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
await sayfa.waitForTimeout(900);
await sayfa.screenshot({ path: cikti });

console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
