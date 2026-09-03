import { describe, it, expect } from 'vitest';
import { turkceyeCevir } from './turkceCevir';

const cevir = (govde: string, fonksiyonlar = '') =>
  turkceyeCevir({ govde, fonksiyonlar }).satirlar.map((s) => '  '.repeat(s.girinti) + s.metin);

describe('turkceyeCevir', () => {
  it('komutları Türkçe okur', () => {
    expect(cevir('ilerle();\nkap();')).toEqual([
      'Program başlar:',
      '  bir kare ilerle',
      '  bastığın karedeki çikolatayı al',
    ]);
  });

  it('sayılı for döngüsünü "kere tekrarla" diye okur', () => {
    expect(cevir('for (int i = 0; i < 12; i++) {\n  ilerle();\n}')).toEqual([
      'Program başlar:',
      '  12 kere şunları tekrarla:',
      '    bir kare ilerle',
    ]);
  });

  it('while koşulunu düz cümleye çevirir', () => {
    expect(cevir('while (!molaOdasindaMiyim()) {\n  ilerle();\n}')[1]).toBe(
      '  mola odasında değilsen şunları tekrarla:',
    );
  });

  it('if ve else dallarını girintiyle ayırır', () => {
    expect(cevir('if (onumdePaletVar()) {\n  sagaDon();\n} else {\n  ilerle();\n}')).toEqual([
      'Program başlar:',
      '  eğer önünde palet varsa şunu yap:',
      '    sağa dön',
      '  değilse şunu yap:',
      '    bir kare ilerle',
    ]);
  });

  it('artırmayı sade Türkçeyle söyler', () => {
    expect(cevir('int sayac = 0;\nsayac++;')).toEqual([
      'Program başlar:',
      '  sayac adında bir sayı oluştur, başlangıç değeri 0',
      '  sayac sayısını 1 artır',
    ]);
  });

  it('kendi fonksiyonunu ayrı başlıkla okur', () => {
    const satirlar = cevir('koseDon();', 'void koseDon() {\n  sagaDon();\n}');
    expect(satirlar[0]).toBe('koseDon komutun şunu yapar:');
    expect(satirlar).toContain('  kendi yazdığın koseDon komutunu çalıştır');
  });

  it('boş kodda ne yapılacağını söyler', () => {
    expect(turkceyeCevir({ govde: '', fonksiyonlar: '' }).hata).toContain('Henüz kod yazmadın');
  });

  it('bozuk kodu çevirmez, sebebini söyler', () => {
    const sonuc = turkceyeCevir({ govde: 'ilerle()', fonksiyonlar: '' });
    expect(sonuc.hata).toContain('noktalı virgül');
  });
});
