import { chromium } from 'playwright';
const SP = process.argv[2];
const NL = String.fromCharCode(10);
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const y = {}; for (let i = 1; i < 10; i++) y[i] = 3;
const kod = ['for (int i = 0; i < 3; i++) {', '    for (int j = 0; j < 4; j++) {', '        ilerle();', '    }', '    sagaDon();', '}'].join(NL);
await s.goto('http://localhost:5177/');
await s.evaluate(([yy, k]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: { 10: { govde: k, fonksiyonlar: '' } },
  gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true })), [y, kod]);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(500);
await s.getByRole('button', { name: /Çalıştır/ }).click();
for (let k = 0; k < 80; k++) {
  if (await s.evaluate(() => !!document.querySelector('.orti'))) break;
  await s.waitForTimeout(300);
}
await s.waitForTimeout(600);
await s.screenshot({ path: `${SP}/b1-basari.png` });
await t.close();
