import { describe, it, expect } from 'vitest';
import { sozcuklereAyir } from './lexer';
import { DerlemeHatasi } from './hatalar';

const tipler = (kod: string) => sozcuklereAyir(kod).map((t) => t.tip);
const degerler = (kod: string) => sozcuklereAyir(kod).map((t) => t.deger);

describe('sozcuklereAyir', () => {
  it('bos kod icin sadece son token uretir', () => {
    expect(tipler('')).toEqual(['son']);
  });

  it('komut cagrisini ad ve isaretlere ayirir', () => {
    expect(degerler('ilerle();')).toEqual(['ilerle', '(', ')', ';', '']);
    expect(tipler('ilerle();')).toEqual(['ad', 'isaret', 'isaret', 'isaret', 'son']);
  });

  it('anahtar kelimeleri addan ayirir', () => {
    const t = sozcuklereAyir('int sayac');
    expect(t[0]).toMatchObject({ tip: 'anahtar', deger: 'int' });
    expect(t[1]).toMatchObject({ tip: 'ad', deger: 'sayac' });
  });

  it('sayilari okur', () => {
    expect(sozcuklereAyir('12')[0]).toMatchObject({ tip: 'sayi', deger: '12' });
  });

  it('satir ve sutun bilgisini tutar', () => {
    const t = sozcuklereAyir('ilerle();\n  kap();');
    expect(t[0]).toMatchObject({ deger: 'ilerle', satir: 1, sutun: 1 });
    expect(t[4]).toMatchObject({ deger: 'kap', satir: 2, sutun: 3 });
  });

  it('iki karakterli operatorleri tek token olarak okur', () => {
    expect(degerler('a <= b == c != d && e || f')).toEqual([
      'a', '<=', 'b', '==', 'c', '!=', 'd', '&&', 'e', '||', 'f', '',
    ]);
  });

  it('artirma ve azaltma operatorlerini okur', () => {
    expect(degerler('i++; j--; k += 2;')).toEqual([
      'i', '++', ';', 'j', '--', ';', 'k', '+=', '2', ';', '',
    ]);
  });

  it('tek satirlik yorumlari atlar', () => {
    expect(degerler('ilerle(); // buraya kadar\nkap();')).toEqual([
      'ilerle', '(', ')', ';', 'kap', '(', ')', ';', '',
    ]);
  });

  it('blok yorumlari atlar', () => {
    expect(degerler('/* aciklama\n devam */ kap();')).toEqual(['kap', '(', ')', ';', '']);
  });

  it('tanimadigi karakter icin satir numarali hata verir', () => {
    try {
      sozcuklereAyir('ilerle();\n@');
      expect.unreachable('hata bekleniyordu');
    } catch (h) {
      expect(h).toBeInstanceOf(DerlemeHatasi);
      expect((h as DerlemeHatasi).satir).toBe(2);
      expect((h as DerlemeHatasi).mesaj).toContain('@');
    }
  });
});
