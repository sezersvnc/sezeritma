import { chromium } from 'playwright';
const cikti = process.argv[2];
const tarayici = await chromium.launch();
const sayfa = await tarayici.newPage({ viewport: { width: 1440, height: 980 } });
const hatalar = [];
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()));
sayfa.on('pageerror', (e) => hatalar.push(String(e)));

await sayfa.goto('http://localhost:5177/#serbest', { waitUntil: 'networkidle' });
await sayfa.evaluate(() => localStorage.removeItem('sezeritma.serbest.v1'));
await sayfa.reload({ waitUntil: 'networkidle' });
await sayfa.waitForTimeout(400);

await sayfa.getByLabel('Genişlik').fill('13');
await sayfa.getByLabel('Yükseklik').fill('11');
await sayfa.getByRole('button', { name: 'Rastgele labirent' }).click();
await sayfa.waitForTimeout(300);

const kod = ['while (!molaOdasindaMiyim()) {', '  solaDon();', '  while (onumdePaletVar()) {', '    sagaDon();', '  }', '  ilerle();', '}'].join('\n');
await sayfa.evaluate((k) => {
  const el = document.querySelectorAll('.cm-content')[1] ?? document.querySelector('.cm-content');
  el.dispatchEvent(new Event('focus'));
  return k;
}, kod);
await sayfa.locator('.cm-content').last().click();
await sayfa.keyboard.insertText(kod);
await sayfa.waitForTimeout(300);
await sayfa.locator('input[type=range]').fill('5');
await sayfa.getByRole('button', { name: /Çalıştır/ }).click();
await sayfa.waitForTimeout(6000);
await sayfa.screenshot({ path: cikti });
const rapor = await sayfa.locator('.rapor').first().textContent().catch(() => '');
console.log('sonuc:', (rapor ?? '').trim().slice(0, 90));
console.log('konsol hatalari:', hatalar.length ? hatalar : 'yok');
await tarayici.close();
