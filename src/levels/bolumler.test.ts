import { describe, it, expect } from 'vitest';
import { BOLUMLER } from './index';
import { cozumuBol } from './bolumOku';
import { calistir, satirSay } from '../core/yurutucu';
import type { KomutAdi, YapiAdi } from '../core/types';

/**
 * Bölüm doğrulayıcı. `npm run bolum:dogrula` bunu çalıştırır.
 * Yeni bölüm yazan kişi motoru hiç okumadan burada geri bildirim alır.
 */

describe('bölüm kataloğu', () => {
  it('bölümler 1den başlayarak kesintisiz numaralanmış', () => {
    expect(BOLUMLER.map((b) => b.no)).toEqual(
      Array.from({ length: BOLUMLER.length }, (_, i) => i + 1),
    );
  });

  it('en az 16 bölüm var', () => {
    expect(BOLUMLER.length).toBeGreaterThanOrEqual(16);
  });

  it('komutlar ve yapılar açıldıktan sonra kapanmıyor', () => {
    const acikKomut = new Set<KomutAdi>();
    const acikYapi = new Set<YapiAdi>();
    for (const b of BOLUMLER) {
      for (const k of acikKomut) {
        expect(b.izinliKomutlar, `Bölüm ${b.no} için "${k}" komutu kapanmış`).toContain(k);
      }
      for (const y of acikYapi) {
        expect(b.izinliYapilar, `Bölüm ${b.no} için "${y}" yapısı kapanmış`).toContain(y);
      }
      b.izinliKomutlar.forEach((k) => acikKomut.add(k));
      b.izinliYapilar.forEach((y) => acikYapi.add(y));
    }
  });
});

describe.each(BOLUMLER.map((b) => [b.no, b.ad, b] as const))(
  'Bölüm %i — %s',
  (_no, _ad, bolum) => {
    const kod = cozumuBol(bolum.referansCozum);

    it('referans çözümü bölümü geçiyor', () => {
      const s = calistir(kod, bolum);
      expect(s.hata?.mesaj ?? '').toBe('');
      expect(s.basarili).toBe(true);
    });

    it('boş kodla geçilemiyor', () => {
      expect(calistir({ govde: '', fonksiyonlar: '' }, bolum).basarili).toBe(false);
    });

    it('referans çözüm en az iki yıldız alıyor', () => {
      expect(calistir(kod, bolum).yildiz).toBeGreaterThanOrEqual(2);
    });

    it('hedef satır referans çözümle tutarlı', () => {
      expect(bolum.hedefSatir).toBe(satirSay(kod));
    });

    it('referans çözüm üç yıldız alabiliyor', () => {
      expect(calistir(kod, bolum).yildiz).toBe(3);
    });

    it('görev metni ve iki kademe ipucu dolu', () => {
      expect(bolum.gorev.length).toBeGreaterThan(15);
      expect(bolum.ipuclari[0].length).toBeGreaterThan(10);
      expect(bolum.ipuclari[1].length).toBeGreaterThan(10);
      expect(bolum.vardiyaNotu.length).toBeGreaterThan(5);
    });

    it('fonksiyon bölmesi sadece izinliyken kullanılıyor', () => {
      if (kod.fonksiyonlar.trim().length > 0) {
        expect(bolum.fonksiyonBolmesi).toBe(true);
      }
    });

    it('harita ekrana sığıyor', () => {
      expect(bolum.izgara.genislik).toBeLessThanOrEqual(16);
      expect(bolum.izgara.yukseklik).toBeLessThanOrEqual(16);
    });
  },
);
