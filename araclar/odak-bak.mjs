import { chromium } from 'playwright';
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const y = {}; for (let i = 1; i < 7; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length: 33}, (_, i) => i), karsilamaGorundu: true })), y);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(500);

for (const [ad, tik] of [['ders', 'anlatımı aç'], ['kavramlar', 'Kavramlar'], ['harita', 'Vardiya çizelgesi']]) {
  await s.getByRole('button', { name: tik }).first().click();
  await s.waitForTimeout(400);
  const acik = await s.evaluate(() => !!document.querySelector('.orti'));
  const disari = [];
  for (let i = 0; i < 16; i++) {
    await s.keyboard.press('Tab');
    const nerede = await s.evaluate(() => {
      const o = document.querySelector('.orti');
      return o ? o.contains(document.activeElement) : null;
    });
    if (nerede === false) disari.push(i);
  }
  console.log(ad, 'acildi:', acik, '| disari kacan tab:', disari.length ? disari : 'yok');
  await s.keyboard.press('Escape');
  await s.waitForTimeout(300);
  const kapandi = await s.evaluate(() => !document.querySelector('.orti'));
  if (!kapandi) { await s.getByRole('button', { name: /Kapat|Devam|Anladım/ }).first().click().catch(()=>{}); await s.waitForTimeout(300); }
  console.log('   Esc kapatti:', kapandi, '| odak geri:', await s.evaluate(() => (document.activeElement?.textContent || '').trim().slice(0, 20)));
}
await t.close();
