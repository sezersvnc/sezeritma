import { chromium } from 'playwright';

/** Oyunu aynı ağdaki başka bir makine gibi, yerel ağ adresinden açar. */
const ADRES = process.argv[2] ?? 'http://192.168.168.215:4173/';
const t = await chromium.launch();
const c = await t.newContext();
const s = await c.newPage({ viewport: { width: 1440, height: 950 } });
const h = [];
s.on('pageerror', (e) => h.push(String(e)));
s.on('console', (m) => m.type() === 'error' && h.push(m.text()));

await s.goto(ADRES, { waitUntil: 'networkidle' });
await s.waitForTimeout(600);
console.log('guvenli baglam:', await s.evaluate(() => window.isSecureContext));
console.log('karsilama acildi:', await s.evaluate(() => !!document.querySelector('.karsilama-orti')));

await s.goto(ADRES + '#serbest', { waitUntil: 'networkidle' });
await s.waitForTimeout(500);
await s.getByRole('button', { name: /Bağlantıyı kopyala/ }).click();
await s.waitForTimeout(300);
console.log('bildirim:', await s.evaluate(() => document.body.innerText.match(/Bağlantı kopyalandı[^.]*\.|Tarayıcı kopyalamaya[^.]*\./)?.[0] ?? 'yok'));
console.log('adres cubugu paylasim kodunu tasiyor:', s.url().includes('#serbest='));
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
