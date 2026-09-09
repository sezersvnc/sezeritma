import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const CR = String.fromCharCode(13), NL = String.fromCharCode(10), AYRAC = '--- main ---';
const cozumOku = (no) => {
  const m = readFileSync(`src/levels/bolumler/${String(no).padStart(2,'0')}.md`, 'utf8').split(CR).join('');
  const c = m.split('## Cozum' + NL)[1].split(NL + '## ')[0].trimEnd();
  if (!c.includes(AYRAC)) return { govde: c, fonksiyonlar: '' };
  const [f, g] = c.split(AYRAC);
  return { fonksiyonlar: f.trimEnd(), govde: g.replace(/^\n+/, '').trimEnd() };
};
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const y = {}; for (let i = 1; i < 32; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate(([yy, k]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: { 32: k }, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), [y, cozumOku(32)]);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(400);
await s.locator('input[type=range]').focus();
await s.keyboard.press('End');
await s.waitForTimeout(200);
console.log('hiz:', await s.evaluate(() => document.querySelector('input[type=range]').value));
await s.waitForTimeout(200);
const t0 = Date.now();
await s.getByRole('button', { name: /Çalıştır/ }).first().click();
for (let k = 0; k < 600; k++) { if (await s.evaluate(() => !!document.querySelector('.orti'))) break; await s.waitForTimeout(100); }
console.log('254 adim, en yuksek hiz:', ((Date.now() - t0) / 1000).toFixed(1) + ' sn');
await t.close();
