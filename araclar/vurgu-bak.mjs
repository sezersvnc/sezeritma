import { chromium } from 'playwright';
const SP = process.argv[2];
const NL = String.fromCharCode(10);
const t = await chromium.launch();
const s = await t.newPage({ viewport: { width: 1440, height: 950 } });
const h = []; s.on('pageerror', e => h.push(String(e))); s.on('console', m => m.type()==='error' && h.push(m.text()));
const kod = ['int sayac = 0;', 'while (!molaOdasindaMiyim()) {', '  if (ustumdeCikolataVar() && sayac < 5) {', '    kap(); // topla', '    sayac++;', '  } else {', '    ilerle();', '  }', '}'].join(NL);
const y = {}; for (let i = 1; i < 20; i++) y[i] = 3;
await s.goto('http://localhost:5177/');
await s.evaluate(([yy, k]) => localStorage.setItem('sezeritma.ilerleme.v1', JSON.stringify({
  yildizlar: yy, kodlar: { 20: { govde: k, fonksiyonlar: 'void koseDon() {' + String.fromCharCode(10) + '  sagaDon();' + String.fromCharCode(10) + '}' } },
  gorulenDersler: Array.from({length:33},(_,i)=>i), karsilamaGorundu: true, dersOtomatik: false })), [y, kod]);
await s.reload({ waitUntil: 'networkidle' });
await s.waitForTimeout(700);
await s.locator('.kod-paneli').screenshot({ path: `${SP}/vurgu.png` });
console.log('hatalar:', h.length ? h : 'yok');
await t.close();
