import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const CR = String.fromCharCode(13);
const NL = String.fromCharCode(10);
const AYRAC = '--- main ---';

const cozumOku = (no) => {
  const m = readFileSync(`src/levels/bolumler/${String(no).padStart(2, '0')}.md`, 'utf8').split(CR).join('');
  const c = m.split('## Cozum' + NL)[1].split(NL + '## ')[0].trimEnd();
  if (!c.includes(AYRAC)) return { govde: c, fonksiyonlar: '' };
  const [f, g] = c.split(AYRAC);
  return { fonksiyonlar: f.trimEnd(), govde: g.replace(/^\n+/, '').trimEnd() };
};

const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const sorunlar = [];
s.on('pageerror', (e) => sorunlar.push('js: ' + e));
s.on('console', (m) => m.type() === 'error' && sorunlar.push('konsol: ' + m.text()));

const kodlar = {};
for (let i = 1; i <= 32; i++) kodlar[i] = cozumOku(i);

for (const no of [1, 5, 6, 7, 12, 17, 21, 24, 27, 30, 32]) {
  const y = {}; for (let i = 1; i < no; i++) y[i] = 3;
  await s.goto('http://localhost:5177/');
  await s.evaluate(([yy, kk]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
    yildizlar: yy, kodlar: kk, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), [y, kodlar]);
  await s.reload({ waitUntil: 'networkidle' });
  await s.waitForTimeout(400);
  const kaydirici = s.locator('input[type=range]');
  if (await kaydirici.count()) { await kaydirici.focus(); await s.keyboard.press('End'); }
  await s.getByRole('button', { name: /Çalıştır/ }).first().click();
  let gecti = false;
  for (let k = 0; k < 400; k++) {
    if (await s.evaluate(() => !!document.querySelector('.orti'))) { gecti = true; break; }
    await s.waitForTimeout(200);
  }
  const yildiz = gecti ? await s.evaluate(() => document.querySelectorAll('.orti .yildiz-sirasi span, .orti .yildizlar span, .orti [class*=yildiz] span').length) : 0;
  console.log('bolum', String(no).padStart(2), gecti ? 'GECTI' : 'GECEMEDI', 'yildiz-oge:', yildiz);
  if (!gecti) sorunlar.push('bolum ' + no + ' referans cozumle gecemedi');
}
console.log(sorunlar.length ? sorunlar : 'sorun yok');
await t.close();
