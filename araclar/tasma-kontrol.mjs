import { chromium } from 'playwright';
const t = await chromium.launch();
for (const [w, h] of [[1440, 950], [1440, 800], [1920, 1080], [1100, 720], [820, 900]]) {
  for (const b of [1, 10, 22]) {
    const s = await t.newPage({ viewport: { width: w, height: h } });
    const y = {}; for (let i = 1; i < b; i++) y[i] = 3;
    await s.goto('http://localhost:5177/');
    await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
      yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), y);
    await s.reload({ waitUntil: 'networkidle' });
    await s.waitForTimeout(400);
    // dolu dokum durumu: bir kod yaz ve calistir
    await s.locator('.cm-content').last().click();
    await s.keyboard.type(['for (int i = 0; i < 8; i++) {', 'ilerle();', 'sagaDon();'].join(String.fromCharCode(10)));
    await s.getByRole('button', { name: /Çalıştır/ }).click();
    await s.evaluate(() => new Promise((r) => setTimeout(r, 100)));
    for (let k = 0; k < 40; k++) {
      const bitti = await s.evaluate(() => !document.querySelector('button.dugme-birincil')?.textContent?.includes('Duraklat'));
      if (bitti) break;
      await s.waitForTimeout(250);
    }
    await s.waitForTimeout(300);
    const o = await s.evaluate(() => {
      const sahne = document.querySelector('.sahne');
      const d = document.querySelector('.dokum');
      return {
        dikeyTasma: sahne.scrollHeight - sahne.clientHeight,
        yatayTasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        dokumAlt: Math.round(d.getBoundingClientRect().bottom),
        pencere: window.innerHeight,
      };
    });
    const kotu = o.dikeyTasma > 2 || o.yatayTasma > 0 || o.dokumAlt > o.pencere;
    console.log(`${w}x${h} b${b}`, JSON.stringify(o), kotu ? '  <-- SORUN' : '');
    await s.close();
  }
}
await t.close();
