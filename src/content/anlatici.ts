import type { Adim, Yon } from '../core/types';

/**
 * Adım anlatıcısı.
 *
 * Animasyon "ne olduğunu" gösteriyor; bu metin "neden olduğunu" söylüyor.
 * Öğrenci kodun hangi satırının hangi hareketi ürettiğini böyle bağlıyor.
 */

const YON_ADI: Record<Yon, string> = {
  kuzey: 'yukarı',
  dogu: 'sağa',
  guney: 'aşağı',
  bati: 'sola',
};

const degisenDegisken = (onceki: Adim | undefined, simdiki: Adim): string | null => {
  for (const [ad, deger] of Object.entries(simdiki.degiskenler)) {
    const eski = onceki?.degiskenler[ad];
    if (eski === undefined && onceki) return `${ad} tanımlandı, değeri ${deger}`;
    if (eski !== undefined && eski !== deger) return `${ad} artık ${deger}`;
  }
  return null;
};

export function adimAnlat(simdiki: Adim | undefined, onceki: Adim | undefined): string {
  if (!simdiki) return 'Çalıştır düğmesine bas, kodun satır satır işlenişini buradan takip et.';

  const yer = `${simdiki.satir}. satır`;
  const degisim = degisenDegisken(onceki, simdiki);

  switch (simdiki.olay) {
    case 'ilerle':
      return `${yer}: Sezer baktığı yöne bir kare gitti.`;
    case 'don':
      return `${yer}: Sezer yerinde döndü, artık ${YON_ADI[simdiki.durum.yon]} bakıyor. Konumu değişmedi.`;
    case 'kap':
      return `${yer}: Çikolatayı kaptı. Çantada ${simdiki.durum.cantada} tane.`;
    case 'giris':
      return `${yer}: Kendi yazdığın komut çağrıldı, içindeki satırlar şimdi çalışacak.`;
    default:
      break;
  }

  if (degisim) return `${yer}: ${degisim}.`;
  return `${yer}: Koşul kontrol edildi, program buna göre devam ediyor.`;
}
