/**
 * Arayüzün kademeli açılması.
 *
 * Dil nasıl bölüm bölüm açılıyorsa, arayüz de öyle açılır. Birinci bölümde
 * ekranda yapılacak tek bir şey vardır. Her düğme, ona ihtiyaç doğduğu
 * bölümde gelir ve geldiğinde neden geldiği söylenir.
 *
 * Gerekçe: yeni başlayan biri için en büyük engel dilin zorluğu değil,
 * aynı anda bakması gereken şeyin fazlalığıdır.
 */

export interface ArayuzOzellikleri {
  /** Adım adım ilerletme ve hız kaydırıcısı. */
  adimKontrolu: boolean;
  /** "Üçüncü yıldız için kaç satır" göstergesi. */
  hedefSatir: boolean;
  /** Kart modu ile klavye arasında geçiş sekmeleri. */
  yazimSekmeleri: boolean;
  /** Kodun Türkçe okunuşu. */
  turkceOku: boolean;
  /** Çalıştırmadan önce sonucu tahmin etme. */
  tahmin: boolean;
  /** Kartların bittiği, klavyenin zorunlu olduğu bölüm. Sadece duyuru için. */
  klavyeZorunlu: boolean;
}

interface Kilit {
  bolum: number;
  anahtar: keyof ArayuzOzellikleri;
  /** O bölümde bir kere gösterilen tanıtım cümlesi. */
  duyuru: string;
}

const KILITLER: readonly Kilit[] = [
  {
    bolum: 3,
    anahtar: 'adimKontrolu',
    duyuru:
      'Adım adım düğmesi açıldı. Kodu tek tek ilerletip her komutun ne yaptığını görebilirsin.',
  },
  {
    bolum: 3,
    anahtar: 'yazimSekmeleri',
    duyuru:
      'İstersen kartları bırakıp kodu kendin yazabilirsin. Kartlara dönmek her zaman serbest.',
  },
  {
    bolum: 7,
    anahtar: 'klavyeZorunlu',
    duyuru:
      'Kartlar burada bitiyor. Döngü bir komut değil, bir yapı; kart olarak dizilemez. Bundan sonra kodu kendin yazacaksın.',
  },
  {
    bolum: 7,
    anahtar: 'hedefSatir',
    duyuru:
      'Artık satır sayısı önemli. Üçüncü yıldızı, işi hedeflenen satırda bitirdiğinde alırsın.',
  },
  {
    bolum: 7,
    anahtar: 'turkceOku',
    duyuru: 'Türkçe oku sekmesi açıldı. Yazdığın kodun Türkçe karşılığını gösterir.',
  },
  {
    bolum: 11,
    anahtar: 'tahmin',
    duyuru:
      'Çalıştırmadan önce ne olacağını tahmin edebilirsin. Kodu okumadan tahmin edemezsin, öğreten kısım da orası.',
  },
];

export function arayuzOzellikleri(bolumNo: number): ArayuzOzellikleri {
  const acik = (anahtar: keyof ArayuzOzellikleri) =>
    KILITLER.some((k) => k.anahtar === anahtar && bolumNo >= k.bolum);

  return {
    adimKontrolu: acik('adimKontrolu'),
    hedefSatir: acik('hedefSatir'),
    yazimSekmeleri: acik('yazimSekmeleri'),
    turkceOku: acik('turkceOku'),
    tahmin: acik('tahmin'),
    klavyeZorunlu: acik('klavyeZorunlu'),
  };
}

/** O bölümde ilk kez açılan özelliklerin duyuruları. */
export const yeniOzellikler = (bolumNo: number): readonly string[] =>
  KILITLER.filter((k) => k.bolum === bolumNo).map((k) => k.duyuru);
