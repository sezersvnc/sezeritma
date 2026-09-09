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
await s.evaluate(() => { const r = document.querySelector('input[type=range]'); r.value = '5'; r.dispatchEvent(new Event('change', { bubbles: true })); });
const cdp = await s.context().newCDPSession(s);
await cdp.send('Profiler.enable');
await cdp.send('Profiler.start');
await s.getByRole('button', { name: /Çalıştır/ }).first().click();
await s.waitForTimeout(5000);
const { profile } = await cdp.send('Profiler.stop');
const kendi = new Map();
const dugum = new Map(profile.nodes.map((n) => [n.id, n]));
const sure = (profile.endTime - profile.startTime) / (profile.samples?.length || 1);
for (const id of profile.samples || []) {
  const n = dugum.get(id);
  if (!n) continue;
  const f = n.callFrame;
  const ad = `${f.functionName || '(anon)'} @ ${(f.url || '').split('/').slice(-1)[0]}:${f.lineNumber}`;
  kendi.set(ad, (kendi.get(ad) || 0) + sure / 1000);
}
[...kendi.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14)
  .forEach(([ad, ms]) => console.log(ms.toFixed(0).padStart(5) + ' ms  ' + ad));
await t.close();
