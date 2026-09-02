import { describe, it, expect } from 'vitest';
import { calistir } from './yurutucu';
import { haritaCoz } from './harita';
import type { Bolum, KomutAdi, YapiAdi } from './types';

const bolumYap = (
  satirlar: string[],
  ek: Partial<Bolum> & { izinliKomutlar?: KomutAdi[]; izinliYapilar?: YapiAdi[] } = {},
): Bolum => {
  const h = haritaCoz(satirlar.join('\n'));
  return {
    no: 1,
    vardiya: 1,
    ad: 'Test',
    kavram: 'test',
    gorev: 'test',
    ipuclari: ['bir', 'iki'],
    vardiyaNotu: 'test',
    izgara: h.izgara,
    paletler: h.paletler,
    cikolatalar: h.cikolatalar,
    mola: h.mola,
    baslangic: { kare: h.baslangicKare, yon: 'dogu' },
    izinliKomutlar: ['ilerle', 'sagaDon', 'solaDon', 'kap', 'molaOdasindaMiyim', 'onumdePaletVar', 'ustumdeCikolataVar'],
    izinliYapilar: ['for', 'while', 'if', 'else', 'degisken', 'fonksiyon'],
    hedefSatir: 99,
    fonksiyonBolmesi: true,
    baslangicKodu: '',
    referansCozum: '',
    ...ek,
  };
};

const kosa = (govde: string, bolum: Bolum, fonksiyonlar = '') =>
  calistir({ govde, fonksiyonlar }, bolum);

const DUZ = ['########', '#S....M#', '########'];
const KORIDOR = ['######', '#S..M#', '######'];

describe('temel yurutme', () => {
  it('komutlari sirayla calistirip bolumu bitirir', () => {
    const s = kosa('ilerle();\nilerle();\nilerle();', bolumYap(KORIDOR));
    expect(s.basarili).toBe(true);
    expect(s.hata).toBeUndefined();
  });

  it('her deyim icin bir adim uretir ve satiri isaretler', () => {
    const s = kosa('ilerle();\nilerle();\nilerle();', bolumYap(KORIDOR));
    expect(s.adimlar.map((a) => a.satir)).toEqual([1, 2, 3]);
    expect(s.adimlar[0].olay).toBe('ilerle');
  });

  it('molaya varmadan biterse uyarir', () => {
    const s = kosa('ilerle();', bolumYap(KORIDOR));
    expect(s.basarili).toBe(false);
    expect(s.hata?.kod).toBe('molaya-varmadi');
  });

  it('cikolata birakilirsa uyarir', () => {
    const s = kosa('ilerle();\nilerle();\nilerle();', bolumYap(['######', '#SC.M#', '######']));
    expect(s.hata?.kod).toBe('cikolata-kaldi');
    expect(s.hata?.mesaj).toContain('1 çikolata');
  });

  it('palete carpinca calismayi durdurur', () => {
    const s = kosa('ilerle();\nilerle();\nilerle();\nilerle();', bolumYap(KORIDOR));
    expect(s.hata?.kod).toBe('palete-carptin');
    expect(s.hata?.satir).toBe(4);
  });
});

describe('donguler', () => {
  it('for dongusunu tekrarlar', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR));
    expect(s.basarili).toBe(true);
    expect(s.adimlar.filter((a) => a.olay === 'ilerle')).toHaveLength(3);
  });

  it('dongu basligini da adim olarak isaretler, boylece basa donus gorunur', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR));
    expect(s.adimlar.filter((a) => a.satir === 1).length).toBeGreaterThan(1);
  });

  it('while dongusunu kosul yanlis olana kadar surdurur', () => {
    const s = kosa('while (!molaOdasindaMiyim()) {\n  ilerle();\n}', bolumYap(KORIDOR));
    expect(s.basarili).toBe(true);
  });

  it('ic ice donguyu calistirir', () => {
    const s = kosa(
      'for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 1; j++) {\n    ilerle();\n  }\n}',
      bolumYap(KORIDOR),
    );
    expect(s.basarili).toBe(true);
  });

  it('sonsuz donguyu yakalar ve sayfayi kilitlemez', () => {
    const s = kosa('while (true) {\n  sagaDon();\n}', bolumYap(KORIDOR));
    expect(s.hata?.kod).toBe('sonsuz-dongu');
    expect(s.hata?.mesaj).toContain('while');
  });
});

describe('kosullar', () => {
  it('if dogruyken govdeyi calistirir', () => {
    const s = kosa(
      'while (!molaOdasindaMiyim()) {\n  if (ustumdeCikolataVar()) {\n    kap();\n  }\n  ilerle();\n}',
      bolumYap(['######', '#SC.M#', '######']),
    );
    expect(s.basarili).toBe(true);
  });

  it('else dalini secer', () => {
    const s = kosa(
      'if (onumdePaletVar()) {\n  sagaDon();\n} else {\n  ilerle();\n}\nilerle();\nilerle();',
      bolumYap(KORIDOR),
    );
    expect(s.basarili).toBe(true);
  });
});

describe('degiskenler', () => {
  it('degisken degerlerini her adimda bildirir', () => {
    const s = kosa('int sayac = 0;\nsayac++;\nsayac++;', bolumYap(KORIDOR));
    expect(s.adimlar.at(-1)?.degiskenler).toEqual({ sayac: 2 });
  });

  it('dongu sayacini izler', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR));
    const ilerlemeler = s.adimlar.filter((a) => a.olay === 'ilerle');
    expect(ilerlemeler.map((a) => a.degiskenler.i)).toEqual([0, 1, 2]);
  });

  it('tanimsiz degiskeni anlasilir sekilde reddeder', () => {
    const s = kosa('sayac = 1;', bolumYap(KORIDOR));
    expect(s.hata?.kod).toBe('bilinmeyen-ad');
    expect(s.hata?.mesaj).toContain('sayac');
  });
});

describe('kendi fonksiyonlarin', () => {
  it('fonksiyon bolmesindeki tanimi cagirir', () => {
    const s = kosa('ikiAdim();\nilerle();', bolumYap(KORIDOR), 'void ikiAdim() {\n  ilerle();\n  ilerle();\n}');
    expect(s.basarili).toBe(true);
  });

  it('fonksiyon icindeki adimlari o bolmeye isaretler', () => {
    const s = kosa('ikiAdim();\nilerle();', bolumYap(KORIDOR), 'void ikiAdim() {\n  ilerle();\n  ilerle();\n}');
    expect(s.adimlar.some((a) => a.bolme === 'fonksiyon')).toBe(true);
  });

  it('bilinmeyen komutu duzeltme onerisiyle reddeder', () => {
    const s = kosa('iflerle();', bolumYap(KORIDOR));
    expect(s.hata?.kod).toBe('bilinmeyen-ad');
    expect(s.hata?.mesaj).toContain('ilerle');
  });
});

describe('bolum kisitlari', () => {
  it('izinli olmayan komutu engeller', () => {
    const s = kosa('kap();', bolumYap(KORIDOR, { izinliKomutlar: ['ilerle'] }));
    expect(s.hata?.kod).toBe('izinsiz-komut');
    expect(s.hata?.mesaj).toContain('kap');
  });

  it('for basligindaki int, ayrica degisken izni gerektirmez', () => {
    const s = kosa(
      ['for (int i = 0; i < 3; i++) {', '  ilerle();', '}'].join('\n'),
      bolumYap(KORIDOR, { izinliYapilar: ['for'] }),
    );
    expect(s.hata?.mesaj ?? '').toBe('');
    expect(s.basarili).toBe(true);
  });

  it('govdedeki int hala degisken izni ister', () => {
    const s = kosa('int a = 0;', bolumYap(KORIDOR, { izinliYapilar: ['for'] }));
    expect(s.hata?.kod).toBe('izinsiz-yapi');
  });

  it('izinli olmayan yapiyi engeller', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR, { izinliYapilar: [] }));
    expect(s.hata?.kod).toBe('izinsiz-yapi');
    expect(s.hata?.mesaj).toContain('for');
  });

  it('sozdizimi hatasini firlatmaz, sonuc olarak dondurur', () => {
    const s = kosa('ilerle()', bolumYap(KORIDOR));
    expect(s.basarili).toBe(false);
    expect(s.hata?.kod).toBe('noktali-virgul-eksik');
  });
});

describe('satir sayimi ve yildiz', () => {
  it('bos ve sadece parantez iceren satirlari saymaz', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n\n  ilerle();\n}', bolumYap(KORIDOR));
    expect(s.kullanilanSatir).toBe(2);
  });

  it('hedefin altinda kalinca ve ipucu kullanilmayinca uc yildiz verir', () => {
    const s = kosa('for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR, { hedefSatir: 2 }));
    expect(s.yildiz).toBe(3);
  });

  it('hedef asilinca yildiz dusurur', () => {
    const s = kosa('ilerle();\nilerle();\nilerle();', bolumYap(KORIDOR, { hedefSatir: 2 }));
    expect(s.yildiz).toBe(2);
  });

  it('ipucu kullanilinca yildiz dusurur', () => {
    const b = bolumYap(KORIDOR, { hedefSatir: 2 });
    const s = calistir({ govde: 'for (int i = 0; i < 3; i++) {\n  ilerle();\n}', fonksiyonlar: '' }, b, {
      ipucuKullanildi: true,
    });
    expect(s.yildiz).toBe(2);
  });

  it('basarisiz cozum yildiz almaz', () => {
    const s = kosa('ilerle();', bolumYap(KORIDOR));
    expect(s.yildiz).toBe(0);
  });
});

describe('DUZ haritasi', () => {
  it('gecerli bir harita uretir', () => {
    expect(() => bolumYap(DUZ)).not.toThrow();
  });
});
