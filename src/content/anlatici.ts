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
    // Koşul sonuçları. Sayaç da değiştiyse ikisi birlikte yazılıyor:
    // döngünün neden bir tur daha döndüğü ancak böyle anlaşılıyor.
    case 'dongu-devam':
      return `${yer}: ${degisim ? `${degisim}. ` : ''}Koşul doğru, döngü bir tur daha dönüyor.`;
    case 'dongu-son':
      return `${yer}: ${degisim ? `${degisim}. ` : ''}Koşul yanlış, döngü burada bitti.`;
    case 'kosul-dogru':
      return `${yer}: Koşul doğru, içerideki satırlar çalışacak.`;
    case 'kosul-else':
      return `${yer}: Koşul yanlış, else'in içindekiler çalışacak.`;
    case 'kosul-yanlis':
      return `${yer}: Koşul yanlış, içerideki satırlar atlandı.`;
    default:
      break;
  }

  if (degisim) return `${yer}: ${degisim}.`;
  return `${yer}: Bu satır çalıştı.`;
}
