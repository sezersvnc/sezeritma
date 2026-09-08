import { describe, it, expect } from 'vitest';
import {
  bolumUret,
  bosIzgara,
  haritaMetni,
  hucreBoya,
  paylasimKodu,
  paylasimiCoz,
  rastgeleLabirent,
  yenidenBoyutlandir,
  type Tasarim,
} from './harita';
import { haritaCoz } from '../core/harita';
import { calistir } from '../core/yurutucu';

const koridor = (): Tasarim => {
  let h = bosIzgara(6, 3);
  h = hucreBoya(h, 1, 1, 'S');
  h = hucreBoya(h, 4, 1, 'M');
  return { hucreler: h, yon: 'dogu' };
};

describe('bosIzgara', () => {
  it('dört kenarı palet ile kapatır', () => {
    expect(haritaMetni(bosIzgara(4, 3))).toBe('####\n#..#\n####');
  });
});

describe('hucreBoya', () => {
  it('kenara boya sürmez', () => {
    expect(hucreBoya(bosIzgara(4, 3), 0, 0, 'C')[0][0]).toBe('#');
  });

  it('ikinci Sezer konulunca birincisi silinir', () => {
    let h = hucreBoya(bosIzgara(5, 3), 1, 1, 'S');
    h = hucreBoya(h, 3, 1, 'S');
    expect(haritaMetni(h)).toBe('#####\n#..S#\n#####');
  });

  it('çikolata birden fazla olabilir', () => {
    let h = hucreBoya(bosIzgara(6, 3), 1, 1, 'C');
    h = hucreBoya(h, 3, 1, 'C');
    expect(haritaMetni(h)).toBe('######\n#C.C.#\n######');
  });
});

describe('yenidenBoyutlandir', () => {
  it('çizilenleri korur ve kenarları yeniden kurar', () => {
    const h = hucreBoya(bosIzgara(5, 3), 2, 1, 'C');
    expect(haritaMetni(yenidenBoyutlandir(h, 7, 3))).toBe('#######\n#.C...#\n#######');
  });
});

describe('bolumUret', () => {
  it('çizilen haritayı oynanabilir bir bölüme çevirir', () => {
    const bolum = bolumUret(koridor(), { govde: 'ilerle();', fonksiyonlar: '' });
    const sonuc = calistir({ govde: 'ilerle();\nilerle();\nilerle();', fonksiyonlar: '' }, bolum);
    expect(sonuc.hata?.mesaj ?? '').toBe('');
    expect(sonuc.basarili).toBe(true);
  });

  it('serbest modda bütün komutlar ve yapılar açıktır', () => {
    const bolum = bolumUret(koridor(), { govde: '', fonksiyonlar: '' });
    expect(bolum.izinliKomutlar).toHaveLength(7);
    expect(bolum.izinliYapilar).toHaveLength(6);
  });
});

describe('paylaşım bağlantısı', () => {
  it('haritayı ve kodu kaybetmeden geri getirir', () => {
    const t = koridor();
    const kod = { govde: 'ilerle(); // çöl şıra ğüz', fonksiyonlar: 'void a() {}' };
    const geri = paylasimiCoz(paylasimKodu(t, kod));
    expect(geri?.tasarim.hucreler).toEqual(t.hucreler);
    expect(geri?.tasarim.yon).toBe('dogu');
    expect(geri?.kod).toEqual(kod);
  });

  it('bozuk bağlantıda null döner', () => {
    expect(paylasimiCoz('bu-gecerli-degil')).toBeNull();
  });
});

describe('rastgeleLabirent', () => {
  const sahteRastgele = () => {
    let i = 0;
    return () => {
      i = (i * 7 + 3) % 11;
      return i / 11;
    };
  };

  it('geçerli bir harita üretir', () => {
    const h = rastgeleLabirent(11, 11, sahteRastgele());
    expect(() => haritaCoz(haritaMetni(h))).not.toThrow();
  });

  it('tam olarak bir Sezer ve bir mola odası koyar', () => {
    const metin = haritaMetni(rastgeleLabirent(13, 9, sahteRastgele()));
    expect((metin.match(/S/g) ?? []).length).toBe(1);
    expect((metin.match(/M/g) ?? []).length).toBe(1);
  });

  it('duvar takibi kuralıyla çözülebilen bir labirent olur', () => {
    const h = rastgeleLabirent(11, 11, sahteRastgele());
    const bolum = bolumUret({ hucreler: h, yon: 'dogu' }, { govde: '', fonksiyonlar: '' });
    const sonuc = calistir(
      {
        // Sol el kuralı: her adımda sola dön, önün kapalıysa açılana kadar sağa dön.
        govde: [
          'while (!molaOdasindaMiyim()) {',
          '  solaDon();',
          '  while (onumdePaletVar()) {',
          '    sagaDon();',
          '  }',
          '  ilerle();',
          '}',
        ].join('\n'),
        fonksiyonlar: '',
      },
      bolum,
    );
    expect(sonuc.basarili).toBe(true);
  });
});
