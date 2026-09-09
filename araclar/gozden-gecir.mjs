import { chromium } from 'playwright';
const SP = process.argv[2];
const tarayici = await chromium.launch();
const hatalar = [];

const ac = async (bolum, gorulen = true) => {
  const sayfa = await tarayici.newPage({ viewport: { width: 1366, height: 900 } });
  sayfa.on('pageerror', (e) => hatalar.push(`${bolum}: ${e}`));
  sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(`${bolum}: ${m.text()}`));
  const y = {};
  for (let i = 1; i < bolum; i++) y[i] = 3;
  await sayfa.goto('http://localhost:5177/');
  await sayfa.evaluate(([yy, g]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
    yildizlar: yy, kodlar: {}, gorulenDersler: g ? Array.from({length: 33}, (_, i) => i) : [], karsilamaGorundu: true,
  })), [y, gorulen]);
  await sayfa.reload({ waitUntil: 'networkidle' });
  await sayfa.waitForTimeout(450);
  return sayfa;
};

for (const b of [1, 3, 7, 11, 20]) {
  const sayfa = await ac(b);
  await sayfa.screenshot({ path: `${SP}/gg-${String(b).padStart(2, '0')}.png` });
  const gorunen = await sayfa.evaluate(() => ({
    sekme: document.querySelectorAll('.yazim-sekmesi').length,
    tahmin: !!document.querySelector('.tahmin'),
    adimAdim: [...document.querySelectorAll('button')].some((b) => b.textContent === 'Adım adım'),
    hiz: !!document.querySelector('.hiz'),
    hedef: [...document.querySelectorAll('.kod-baslik .etiket')].length,
    kare: getComputedStyle(document.querySelector('.zemin-cerceve')).getPropertyValue('--kare').trim(),
  }));
  console.log('bolum', String(b).padStart(2), JSON.stringify(gorunen));
  await sayfa.close();
}

// karsilamanin son sayfasi
const sayfa = await tarayici.newPage({ viewport: { width: 1366, height: 900 } });
sayfa.on('pageerror', (e) => hatalar.push(`karsilama: ${e}`));
await sayfa.goto('http://localhost:5177/');
await sayfa.evaluate(() => localStorage.clear());
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(500);
for (let i = 0; i < 5; i++) { await sayfa.getByRole('button', { name: 'Devam', exact: true }).click(); await sayfa.waitForTimeout(200); }
await sayfa.screenshot({ path: `${SP}/gg-seviye.png` });
await sayfa.getByRole('button', { name: 'Döngü ve koşul biliyorum' }).click();
await sayfa.getByRole('button', { name: 'Başla', exact: true }).click();
await sayfa.waitForTimeout(500);
const nerede = await sayfa.locator('.gorev-karti h1').textContent();
console.log('seviye secildi -> bolum:', nerede);
await sayfa.close();

console.log('hatalar:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
