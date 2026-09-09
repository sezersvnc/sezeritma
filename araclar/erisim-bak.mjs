import { chromium } from 'playwright';
const t = await chromium.launch();
const sorunlar = [];

const ac = async (b) => {
  const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
  const y = {}; for (let i = 1; i < b; i++) y[i] = 3;
  await s.goto('http://localhost:5177/');
  await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
    yildizlar: yy, kodlar: {}, gorulenDersler: Array.from({length: 33}, (_, i) => i), karsilamaGorundu: true })), y);
  await s.reload({ waitUntil: 'networkidle' });
  await s.waitForTimeout(500);
  return s;
};

for (const b of [1, 7, 24]) {
  const s = await ac(b);
  // isimsiz interaktif ogeler
  const isimsiz = await s.evaluate(() => [...document.querySelectorAll('button, a, input, [role="button"]')]
    .filter(e => !(e.textContent || '').trim() && !e.getAttribute('aria-label') && !e.getAttribute('title'))
    .map(e => e.className || e.tagName));
  if (isimsiz.length) sorunlar.push(`bolum ${b}: isimsiz oge ${JSON.stringify(isimsiz)}`);

  // odak gorunurlugu
  const odak = [];
  for (let i = 0; i < 14; i++) {
    await s.keyboard.press('Tab');
    odak.push(await s.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return 'BODY';
      const st = getComputedStyle(e);
      const gorunur = st.outlineStyle !== 'none' || st.boxShadow !== 'none' || st.borderColor;
      return `${(e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 22)}${gorunur ? '' : ' [ODAK YOK]'}`;
    }));
  }
  console.log('bolum', b, 'tab sirasi:', JSON.stringify(odak));
  await s.close();
}

// modal icinde odak tuzagi ve Esc
const s = await ac(7);
await s.getByRole('button', { name: /anlatımı aç/i }).click().catch(() => {});
await s.waitForTimeout(400);
console.log('ders acik mi:', await s.evaluate(() => !!document.querySelector('.ders-karti, .katman')));
await s.keyboard.press('Escape');
await s.waitForTimeout(300);
console.log('Esc kapatti mi:', await s.evaluate(() => !document.querySelector('.ders-karti')));
await s.close();
await t.close();
console.log(sorunlar.length ? sorunlar : 'isimsiz oge yok');
