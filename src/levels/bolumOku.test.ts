import { describe, it, expect } from 'vitest';
import { bolumOku } from './bolumOku';

const ORNEK = `# 6 — Aynı Koridor, Tek Satır

vardiya: 2
kavram: for döngüsü
izinliKomutlar: ilerle, sagaDon
izinliYapilar: for, degisken
hedefSatir: 2

## Harita
######
#S..M#
######

## Yon
dogu

## Gorev
Koridorun sonuna git.

## Ipucu1
Aynı komutu tekrar tekrar yazmak zorunda mısın?

## Ipucu2
\`for (int i = 0; i < 3; i++) { }\` yaz.

## Cozum
for (int i = 0; i < 3; i++) {
  ilerle();
}

## VardiyaNotu
Vardiya 6 tamamlandı.
`;

describe('bolumOku', () => {
  const b = bolumOku(ORNEK, 6);

  it('numarayi ve adi okur', () => {
    expect(b.no).toBe(6);
    expect(b.ad).toBe('Aynı Koridor, Tek Satır');
  });

  it('ust bilgi alanlarini okur', () => {
    expect(b.vardiya).toBe(2);
    expect(b.kavram).toBe('for döngüsü');
    expect(b.hedefSatir).toBe(2);
  });

  it('izinli komut ve yapilari listeye cevirir', () => {
    expect(b.izinliKomutlar).toEqual(['ilerle', 'sagaDon']);
    expect(b.izinliYapilar).toEqual(['for', 'degisken']);
  });

  it('haritayi koordinatlara cevirir', () => {
    expect(b.izgara).toEqual({ genislik: 6, yukseklik: 3 });
    expect(b.baslangic).toEqual({ kare: { x: 1, y: 1 }, yon: 'dogu' });
    expect(b.mola).toEqual({ x: 4, y: 1 });
  });

  it('metin alanlarini okur', () => {
    expect(b.gorev).toBe('Koridorun sonuna git.');
    expect(b.ipuclari[0]).toContain('tekrar tekrar');
    expect(b.vardiyaNotu).toBe('Vardiya 6 tamamlandı.');
  });

  it('referans cozumu bosluklarini koruyarak okur', () => {
    expect(b.referansCozum).toBe('for (int i = 0; i < 3; i++) {\n  ilerle();\n}');
  });

  it('fonksiyon bolmesini izinli yapilardan cikarir', () => {
    expect(b.fonksiyonBolmesi).toBe(false);
  });

  it('izinliYapilar tire ise bos liste uretir', () => {
    const y = bolumOku(ORNEK.replace('izinliYapilar: for, degisken', 'izinliYapilar: -'), 6);
    expect(y.izinliYapilar).toEqual([]);
  });

  it('fonksiyon izinliyse bolmeyi acar ve cozumu ikiye ayirir', () => {
    const metin = ORNEK.replace('izinliYapilar: for, degisken', 'izinliYapilar: fonksiyon').replace(
      '## Cozum\nfor (int i = 0; i < 3; i++) {\n  ilerle();\n}',
      '## Cozum\nvoid ikiAdim() {\n  ilerle();\n}\n--- main ---\nikiAdim();',
    );
    const f = bolumOku(metin, 15);
    expect(f.fonksiyonBolmesi).toBe(true);
    expect(f.referansCozum).toBe('void ikiAdim() {\n  ilerle();\n}\n--- main ---\nikiAdim();');
  });

  it('eksik bolumu adiyla birlikte reddeder', () => {
    expect(() => bolumOku(ORNEK.replace('## Ipucu2', '## Ipucu9'), 6)).toThrow(/Ipucu2/);
  });

  it('tanimadigi komut adini reddeder', () => {
    expect(() => bolumOku(ORNEK.replace('ilerle, sagaDon', 'ilerle, ucus'), 6)).toThrow(/ucus/);
  });

  it('gecersiz yonu reddeder', () => {
    expect(() => bolumOku(ORNEK.replace('## Yon\ndogu', '## Yon\nsaga'), 6)).toThrow(/saga/);
  });
});
