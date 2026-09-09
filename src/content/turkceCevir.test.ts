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

  it('sayaci kullanan for dongusunde uc parcayi da yazar', () => {
    // "N kere tekrarla" burada yanıltıcı olur: i gövdede değer olarak kullanılıyor.
    const satir = cevir('for (int i = 1; i <= 3; i++) {\n  ilerleN(i);\n}', 'void ilerleN(int n) {\n  ilerle();\n}')
      .find((x) => x.includes('tekrarla'));
    expect(satir).toContain('i sayacını 1 yap');
    expect(satir).toContain('her turun sonunda i sayısını 1 artır');
  });

  it('fonksiyona verilen degeri okur', () => {
    const satirlar = cevir('ilerleN(3);', 'void ilerleN(int n) {\n  ilerle();\n}');
    expect(satirlar[0]).toBe('ilerleN komutun, verdiğin n değeriyle şunu yapar:');
    expect(satirlar).toContain('  kendi yazdığın ilerleN komutunu 3 değeriyle çalıştır');
  });

  it('else if zincirini tek zincir olarak okur', () => {
    expect(
      cevir('if (ustumdeCikolataVar()) { kap(); } else if (onumdePaletVar()) { sagaDon(); } else { ilerle(); }'),
    ).toEqual([
      'Program başlar:',
      '  eğer bastığın karede çikolata varsa şunu yap:',
      '    bastığın karedeki çikolatayı al',
      '  değilse, eğer önünde palet varsa şunu yap:',
      '    sağa dön',
      '  hiçbiri değilse şunu yap:',
      '    bir kare ilerle',
    ]);
  });

  it('bool degiskeni sayi gibi okumaz', () => {
    const satirlar = cevir('bool aldim = false;\nif (!aldim) { kap(); }');
    expect(satirlar[1]).toContain('doğru/yanlış tutan bir kutu');
    expect(satirlar[2]).toBe('  eğer aldim yanlışsa şunu yap:');
  });

  it('kalanli karsilastirmayi duzgun cumle kurar', () => {
    const satir = cevir('int a = 3;\nif (a % 3 == 0) { sagaDon(); }')[2];
    expect(satir).toBe('  eğer a sayısının 3 ile bölümünden kalan, 0 ise şunu yap:');
  });
});
