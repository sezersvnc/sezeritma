import { chromium } from 'playwright';
const g = Number(process.argv[2] ?? 820);
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: g, height: 1000 } });
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({ yildizlar: {1:3,2:3,3:3,4:3,5:3,6:3,7:3,8:3,9:3,10:3,11:3}, kodlar: {}, gorulenDersler: [1,5,9,12] })));
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
const sucular = await sayfa.evaluate((genislik) => {
  const liste = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > genislik + 1 && r.width > 0) {
      liste.push({ etiket: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0], sag: Math.round(r.right), gen: Math.round(r.width) });
    }
  });
  return liste.slice(0, 12);
}, g);
console.log(g, JSON.stringify(sucular, null, 1));
await tarayici.close();
