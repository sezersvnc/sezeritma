import { describe, it, expect } from 'vitest';
import { DERSLER, VARDIYALAR } from './dersler';
import { bolumUret, haritaOku } from '../serbest/harita';
import { cozumuBol } from '../levels/bolumOku';
import { calistir } from '../core/yurutucu';
import { BOLUMLER } from '../levels';

describe('ders kataloğu', () => {
  it('her ders var olan bir bölüme bağlı', () => {
    const numaralar = new Set(BOLUMLER.map((b) => b.no));
    DERSLER.forEach((d) => expect(numaralar.has(d.bolum)).toBe(true));
  });

  it('dersler bölüm sırasına göre dizili', () => {
    const sirali = [...DERSLER].sort((a, b) => a.bolum - b.bolum);
    expect(DERSLER.map((d) => d.bolum)).toEqual(sirali.map((d) => d.bolum));
  });

  it('her vardiyanın girişi ve özeti dolu', () => {
    VARDIYALAR.forEach((v) => {
      expect(v.giris.length).toBeGreaterThan(40);
      expect(v.ozet.length).toBeGreaterThan(40);
    });
  });

  it('anlatım maddeleri kısa tutulmuş', () => {
    DERSLER.forEach((d) => {
      expect(d.nasil.length).toBeGreaterThan(1);
      d.nasil.forEach((madde) => {
        expect(madde.length, `${d.baslik}: "${madde}"`).toBeLessThan(120);
      });
    });
  });
});

describe.each(DERSLER.filter((d) => d.demo).map((d) => [d.bolum, d.baslik, d] as const))(
  'Ders %i — %s gösterisi',
  (_no, _ad, ders) => {
    const demo = ders.demo!;
    const kod = cozumuBol(demo.kod);

    it('hatasız çalışıyor ve haritayı bitiriyor', () => {
      const bolum = bolumUret({ hucreler: haritaOku(demo.harita.join('\n')), yon: demo.yon }, kod);
      const sonuc = calistir(kod, bolum);
      expect(sonuc.hata?.mesaj ?? '').toBe('');
      expect(sonuc.basarili).toBe(true);
    });

    it('izlenecek kadar kısa', () => {
      const bolum = bolumUret({ hucreler: haritaOku(demo.harita.join('\n')), yon: demo.yon }, kod);
      expect(calistir(kod, bolum).adimlar.length).toBeLessThanOrEqual(40);
    });
  },
);
