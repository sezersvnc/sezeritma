import { chromium } from 'playwright';
const genislikler = [1920, 1440, 1180, 1100, 960, 860, 820, 720, 600, 430];
const tarayici = await chromium.launch();
for (const g of genislikler) {
  const sayfa = await tarayici.newPage({ viewport: { width: g, height: 900 } });
  await sayfa.goto('http://localhost:5177/', { waitUntil: 'networkidle' });
  await sayfa.evaluate(() => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({ yildizlar: {1:3,2:3,3:3,4:3,5:3,6:3,7:3,8:3,9:3,10:3,11:3}, kodlar: {}, gorulenDersler: [1,5,9,12] })));
  await sayfa.reload({ waitUntil: 'networkidle' });
  await sayfa.waitForTimeout(400);
  const olcum = await sayfa.evaluate(() => ({
    tasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    komutKod: Math.round(document.querySelector('.komut code')?.getBoundingClientRect().width ?? 0),
    panel: Math.round(document.querySelector('.kod-paneli')?.getBoundingClientRect().width ?? 0),
    izgara: Math.round(document.querySelector('.zemin-cerceve')?.getBoundingClientRect().width ?? 0),
    sahne: Math.round(document.querySelector('.sahne')?.getBoundingClientRect().width ?? 0),
    izgaraAlt: Math.round(document.querySelector('.zemin-cerceve')?.getBoundingClientRect().bottom ?? 0),
    gorevAlt: Math.round(document.querySelector('.gorev-karti')?.getBoundingClientRect().bottom ?? 0),
  }));
  console.log(String(g).padStart(5), JSON.stringify(olcum));
  await sayfa.close();
}
await tarayici.close();
