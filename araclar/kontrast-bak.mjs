import { chromium } from 'playwright';

/**
 * Ekrandaki her metnin arka planıyla kontrastını ölçer.
 *
 * Jetonlara bakarak tahmin etmek yerine gerçekten çizilen renkleri okur.
 * WCAG AA eşiği: normal metin 4.5, büyük metin (18.66px+ ya da 14px kalın) 3.0.
 */

function olc() {
  const luminans = (r, g, b) => {
    const v = [r, g, b].map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const ayir = (renk) => (renk.match(/[0-9.]+/g) || []).map(Number);
  const zemin = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const r = ayir(getComputedStyle(n).backgroundColor);
      if (r.length >= 3 && (r[3] === undefined || r[3] > 0.85)) return r;
      n = n.parentElement;
    }
    return [255, 255, 255];
  };
  const sonuc = [];
  document.querySelectorAll('*').forEach((el) => {
    const metin = [...el.childNodes]
      .filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.trim())
      .join(' ');
    if (!metin) return;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || Number(st.opacity) < 0.6) return;
    const yer = el.getBoundingClientRect();
    if (yer.width === 0 || yer.height === 0) return;
    const on = ayir(st.color);
    const arka = zemin(el);
    if (on.length < 3 || arka.length < 3) return;
    const l1 = luminans(on[0], on[1], on[2]);
    const l2 = luminans(arka[0], arka[1], arka[2]);
    const oran = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const boy = parseFloat(st.fontSize);
    const kalin = Number(st.fontWeight) >= 700;
    const esik = boy >= 24 || (boy >= 18.66 && kalin) ? 3 : 4.5;
    sonuc.push({
      secici:
        el.className && typeof el.className === 'string'
          ? '.' + el.className.split(' ')[0]
          : el.tagName.toLowerCase(),
      metin: metin.slice(0, 32),
      oran: Math.round(oran * 100) / 100,
      esik,
      boy: Math.round(boy),
      kaldi: oran < esik,
    });
  });
  return sonuc;
}

const t = await chromium.launch();
const bulunanlar = new Map();
const ac = async (b, sonra) => {
  const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
  const y = {}; for (let i = 1; i < b; i++) y[i] = 3;
  await s.goto('http://localhost:5177/');
  await s.evaluate((yy) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
    yildizlar: yy, kodlar: {}, gorulenDersler: [], karsilamaGorundu: true })), y);
  await s.reload({ waitUntil: 'networkidle' });
  await s.waitForTimeout(500);
  // Kendiliğinden açılan anlatım penceresi kapatılır; ölçülecek ekran arkadaki.
  if (await s.evaluate(() => !!document.querySelector('.orti'))) {
    await s.keyboard.press('Escape');
    await s.waitForTimeout(300);
  }
  if (sonra) await sonra(s);
  const liste = await s.evaluate(olc);
  liste.forEach((k) => bulunanlar.set(k.secici + '|' + k.metin, k));
  await s.close();
};

await ac(5);
await ac(20, async (s) => { await s.locator('.harita-dugmesi', { hasText: 'Kavramlar' }).click(); await s.waitForTimeout(400); });
await ac(20, async (s) => { await s.locator('.harita-dugmesi', { hasText: 'Vardiya' }).click(); await s.waitForTimeout(400); });
await ac(13, async (s) => { await s.getByRole('button', { name: /anlatımı aç/i }).click(); await s.waitForTimeout(400); });
await ac(2, async (s) => {
  await s.getByRole('button', { name: /ilerle/ }).first().click();
  await s.getByRole('button', { name: /Çalıştır/ }).click();
  await s.waitForTimeout(2000);
});

const hepsi = [...bulunanlar.values()].sort((a, b) => a.oran - b.oran);
const kotu = hepsi.filter((k) => k.kaldi);
console.log(`olculen metin: ${hepsi.length}, esigin altinda: ${kotu.length}`);
if (kotu.length) {
  console.log(
    kotu
      .map((k) => `${String(k.oran).padStart(5)} (esik ${k.esik}, ${k.boy}px)  ${k.secici}  "${k.metin}"`)
      .join(String.fromCharCode(10)),
  );
}
await t.close();
