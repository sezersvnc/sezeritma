import { chromium, devices } from 'playwright';
const SP = process.argv[2];
const t = await chromium.launch();
const c = await t.newContext({ ...devices['iPhone 13'] });
const s = await c.newPage();
const h = []; s.on('pageerror', e => h.push(String(e))); s.on('console', m => m.type()==='error' && h.push(m.text()));
await s.goto('http://localhost:5177/');
await s.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: {}, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })));
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(600);
await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.getByRole('button', { name: /ilerle/ }).first().click();
await s.waitForTimeout(200);
const olc = () => s.evaluate(() => {
  const z = document.querySelector('.zemin-cerceve').getBoundingClientRect();
  return { ust: Math.round(z.top), alt: Math.round(z.bottom), gorunur: z.bottom > 0 && z.top < window.innerHeight, y: Math.round(window.scrollY) };
});
console.log('once  ', JSON.stringify(await olc()));
await s.getByRole('button', { name: /Çalıştır/ }).click();
for (const ms of [200, 500, 1200, 2500]) { await s.waitForTimeout(ms === 200 ? 200 : 300); console.log(ms + 'ms', JSON.stringify(await olc())); }
await s.screenshot({ path: `${SP}/tel-calisirken.png` });
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
