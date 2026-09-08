import type { CalismaSonucu } from '../core/types';

/**
 * Tahmin.
 *
 * Öğrenci Çalıştır'a basmadan önce ne olacağını seçiyor. Sonra gerçekten
 * ne olduğunu görüyor. Kod okumayı öğreten en güçlü alışkanlık budur:
 * çalıştırmadan önce zihninde çalıştırmak.
 *
 * Seçenekler bölüm bölüm yazılmıyor, motorun ürettiği sonuçtan çıkıyor.
 * Yani her bölümde ve serbest modda kendiliğinden çalışıyor.
 */

export type TahminTuru = 'gecer' | 'gecemez' | 'hata' | 'bitmez';

export interface TahminSecenegi {
  tur: TahminTuru;
  metin: string;
  aciklama: string;
}

export const TAHMIN_SECENEKLERI: readonly TahminSecenegi[] = [
  {
    tur: 'gecer',
    metin: 'Bölümü geçer',
    aciklama: 'Mola odasına varır ve depoda çikolata kalmaz.',
  },
  {
    tur: 'gecemez',
    metin: 'Çalışır ama geçemez',
    aciklama: 'Hata vermez, ama molaya varamaz ya da çikolata bırakır.',
  },
  {
    tur: 'hata',
    metin: 'Hata verir',
    aciklama: 'Palete çarpar, boş karede toplar ya da yazım hatası vardır.',
  },
  {
    tur: 'bitmez',
    metin: 'Hiç bitmez',
    aciklama: 'Sonsuz döngüye girer.',
  },
];

/** Motorun sonucunu dört tahminden birine indirger. */
export function sonucTuru(sonuc: CalismaSonucu): TahminTuru {
  if (sonuc.basarili) return 'gecer';
  const kod = sonuc.hata?.kod;
  if (kod === 'sonsuz-dongu') return 'bitmez';
  if (kod === 'molaya-varmadi' || kod === 'cikolata-kaldi') return 'gecemez';
  return 'hata';
}

export const tahminSecenegi = (tur: TahminTuru): TahminSecenegi =>
  TAHMIN_SECENEKLERI.find((s) => s.tur === tur) ?? TAHMIN_SECENEKLERI[0];

/** Tahmin tuttuğunda ve tutmadığında gösterilecek metin. */
export function tahminGeriBildirimi(tahmin: TahminTuru, gercek: TahminTuru): string {
  if (tahmin === gercek) {
    return `Tahminin tuttu: ${tahminSecenegi(gercek).metin.toLocaleLowerCase('tr')}. Kodu doğru okumuşsun.`;
  }
  return `Sen "${tahminSecenegi(tahmin).metin}" dedin, sonuç "${tahminSecenegi(gercek).metin}" oldu. Farkın nereden çıktığını bulmak, kodu baştan yazmaktan daha öğreticidir.`;
}
