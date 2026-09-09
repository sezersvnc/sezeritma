import { chromium } from 'playwright';
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const h = []; s.on('pageerror', e => h.push(String(e))); s.on('console', m => m.type()==='error' && h.push(m.text()));
await s.goto('http://localhost:5177/');
await s.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: {}, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })));
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(700);
console.log('hatalar:', h.length ? h : 'yok');
console.log('gorev karti:', await s.evaluate(() => document.querySelector('.gorev-karti')?.textContent?.slice(0,80) ?? 'YOK'));
console.log('dugmeler:', await s.evaluate(() => [...document.querySelectorAll('button')].map(b=>b.textContent.trim().slice(0,18)).slice(0,10)));
await t.close();
