import { chromium, devices } from 'playwright';
const t = await chromium.launch();
const c = await t.newContext({ ...devices['iPhone 13'] });
const s = await c.newPage();
const h = []; s.on('pageerror', e => h.push(String(e))); s.on('console', m => m.type()==='error' && h.push(m.text()));
await s.goto('http://localhost:5177/');
await s.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: {}, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })));
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(600);
// dort kart: duvara carpacak
for (let i = 0; i < 4; i++) await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.getByRole('button', { name: /Çalıştır/ }).click();
await s.waitForTimeout(2500);
console.log('hata mesaji gorunur mu:', await s.evaluate(() => {
  const r = document.querySelector('.rapor-hata');
  if (!r) return 'rapor yok';
  const y = r.getBoundingClientRect();
  return { gorunur: y.top >= 0 && y.bottom <= window.innerHeight, ust: Math.round(y.top) };
}));
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
