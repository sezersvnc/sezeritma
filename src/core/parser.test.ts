import { describe, it, expect } from 'vitest';
import { ayristir } from './parser';
import { DerlemeHatasi } from './hatalar';

const hataYakala = (govde: string, fonksiyonlar = '') => {
  try {
    ayristir(govde, fonksiyonlar);
  } catch (h) {
    if (h instanceof DerlemeHatasi) return h;
    throw h;
  }
  throw new Error('hata bekleniyordu ama kod sorunsuz ayrıştı');
};

describe('ayristir — temel ifadeler', () => {
  it('tek komut cagrisini okur', () => {
    const p = ayristir('ilerle();');
    expect(p.main.govde).toEqual([{ tip: 'cagri', ad: 'ilerle', satir: 1, bolme: 'govde' }]);
  });

  it('birden fazla komutu sirayla okur', () => {
    const p = ayristir('ilerle();\nsagaDon();\nkap();');
    expect(p.main.govde.map((d) => (d as { ad: string }).ad)).toEqual(['ilerle', 'sagaDon', 'kap']);
    expect(p.main.govde.map((d) => d.satir)).toEqual([1, 2, 3]);
  });

  it('bos kod bos govde uretir', () => {
    expect(ayristir('').main.govde).toEqual([]);
  });
});

describe('ayristir — degiskenler', () => {
  it('int tanimini okur', () => {
    const p = ayristir('int sayac = 0;');
    expect(p.main.govde[0]).toMatchObject({ tip: 'tanim', ad: 'sayac' });
  });

  it('atamayi okur', () => {
    const p = ayristir('int a = 0;\na = a + 1;');
    expect(p.main.govde[1]).toMatchObject({ tip: 'atama', ad: 'a' });
  });

  it('artirma operatorunu okur', () => {
    const p = ayristir('int a = 0;\na++;');
    expect(p.main.govde[1]).toMatchObject({ tip: 'atama', ad: 'a' });
  });
});

describe('ayristir — akis yapilari', () => {
  it('for dongusunu okur', () => {
    const p = ayristir('for (int i = 0; i < 3; i++) {\n  ilerle();\n}');
    const d = p.main.govde[0] as { tip: string; govde: { govde: unknown[] } };
    expect(d.tip).toBe('for');
    expect(d.govde.govde).toHaveLength(1);
  });

  it('while dongusunu okur', () => {
    const p = ayristir('while (!molaOdasindaMiyim()) {\n  ilerle();\n}');
    expect(p.main.govde[0]).toMatchObject({ tip: 'while' });
  });

  it('if ve else dallarini okur', () => {
    const p = ayristir('if (onumdePaletVar()) {\n  sagaDon();\n} else {\n  ilerle();\n}');
    const d = p.main.govde[0] as { tip: string; degilse: unknown };
    expect(d.tip).toBe('if');
    expect(d.degilse).toBeDefined();
  });

  it('else if zincirini okur', () => {
    const p = ayristir('if (a) {\n} else if (b) {\n}');
    const d = p.main.govde[0] as { degilse: { tip: string } };
    expect(d.degilse.tip).toBe('if');
  });

  it('ic ice dongu okur', () => {
    const p = ayristir('for (int i = 0; i < 2; i++) {\n  for (int j = 0; j < 2; j++) {\n    ilerle();\n  }\n}');
    const dis = p.main.govde[0] as { govde: { govde: { tip: string }[] } };
    expect(dis.govde.govde[0].tip).toBe('for');
  });
});

describe('ayristir — islem onceligi', () => {
  it('&& operatorunu karsilastirmadan sonra baglar', () => {
    const p = ayristir('while (sayac < 5 && !molaOdasindaMiyim()) {\n}');
    const kosul = (p.main.govde[0] as { kosul: { tip: string; op: string } }).kosul;
    expect(kosul).toMatchObject({ tip: 'ikili', op: '&&' });
  });

  it('carpmayi toplamadan once baglar', () => {
    const p = ayristir('int a = 1 + 2 * 3;');
    const deger = (p.main.govde[0] as { deger: { op: string; sag: { op: string } } }).deger;
    expect(deger.op).toBe('+');
    expect(deger.sag.op).toBe('*');
  });
});

describe('ayristir — fonksiyon bolmesi', () => {
  it('void fonksiyon tanimini okur ve bolme bilgisini isler', () => {
    const p = ayristir('koseDon();', 'void koseDon() {\n  sagaDon();\n  ilerle();\n}');
    expect(p.fonksiyonlar).toHaveLength(1);
    expect(p.fonksiyonlar[0]).toMatchObject({ ad: 'koseDon', bolme: 'fonksiyon' });
    expect(p.fonksiyonlar[0].govde.govde[0].bolme).toBe('fonksiyon');
  });
});

describe('ayristir — hata mesajlari', () => {
  it('eksik noktali virgulu satiriyla soyler', () => {
    const h = hataYakala('ilerle()\nkap();');
    expect(h.kod).toBe('noktali-virgul-eksik');
    expect(h.satir).toBe(1);
    expect(h.mesaj).toContain('noktalı virgül');
  });

  it('kapanmayan suslu parantezi soyler', () => {
    const h = hataYakala('for (int i = 0; i < 3; i++) {\n  ilerle();');
    expect(h.kod).toBe('parantez-kapanmadi');
    expect(h.satir).toBe(1);
  });

  it('parantezsiz komut cagrisini duzeltmeyi onerir', () => {
    const h = hataYakala('ilerle;');
    expect(h.mesaj).toContain('ilerle();');
  });

  it('desteklenmeyen kelimeyi anlasilir sekilde reddeder', () => {
    const h = hataYakala('cout << 5;');
    expect(h.kod).toBe('desteklenmeyen');
    expect(h.mesaj).toContain('cout');
  });

  it('fonksiyon bolmesindeki hatayi o bolmeye isaretler', () => {
    const h = hataYakala('', 'void koseDon() {\n  sagaDon()\n}');
    expect(h.bolme).toBe('fonksiyon');
    expect(h.satir).toBe(2);
  });
});
