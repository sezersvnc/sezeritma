// Sezeritma sözleşmesi.
// Bu dosya iki tarafın anlaştığı yerdir: motor ne alır, ne döndürür,
// panel bileşenleri hangi props'ları bekler. Tek taraflı değiştirilmez.

// ---------------------------------------------------------------- dünya

export type Yon = 'kuzey' | 'dogu' | 'guney' | 'bati';

export interface Kare {
  x: number;
  y: number;
}

/** Sezer'in o andaki hali. Simülasyon boyunca değişmez nesneler üretilir. */
export interface Durum {
  kare: Kare;
  yon: Yon;
  /** Henüz toplanmamış çikolatalar. */
  kalanCikolatalar: readonly Kare[];
  cantada: number;
}

// ---------------------------------------------------------------- bölüm

export const KOMUTLAR = [
  'ilerle',
  'sagaDon',
  'solaDon',
  'kap',
  'molaOdasindaMiyim',
  'onumdePaletVar',
  'ustumdeCikolataVar',
] as const;
export type KomutAdi = (typeof KOMUTLAR)[number];

export const YAPILAR = ['for', 'while', 'if', 'else', 'degisken', 'fonksiyon'] as const;
export type YapiAdi = (typeof YAPILAR)[number];

export interface Bolum {
  no: number;
  vardiya: 1 | 2 | 3 | 4;
  ad: string;
  /** Bu bölümün öğrettiği tek yeni şey. */
  kavram: string;
  /** Öğrenciye görünen görev. Ne yapılacağını söyler, nasıl yapılacağını değil. */
  gorev: string;
  /** İki kademe: nazik itme, sonra neredeyse cevap. */
  ipuclari: readonly [string, string];
  /** Bölüm geçilince çıkan tek satırlık mizah. */
  vardiyaNotu: string;

  izgara: { genislik: number; yukseklik: number };
  paletler: readonly Kare[];
  cikolatalar: readonly Kare[];
  mola: Kare;
  baslangic: { kare: Kare; yon: Yon };

  izinliKomutlar: readonly KomutAdi[];
  izinliYapilar: readonly YapiAdi[];
  /** Üçüncü yıldız için en fazla bu kadar satır. Parantez satırları sayılmaz. */
  hedefSatir: number;
  /** 15. bölümden itibaren main() üstünde ikinci düzenlenebilir bölme açılır. */
  fonksiyonBolmesi: boolean;

  baslangicKodu: string;
  /** Doğrulayıcının bölümü otomatik oynatmak için kullandığı çözüm. */
  referansCozum: string;
}

/** Öğrencinin editördeki iki bölmesi. Kilitli iskelet burada yok. */
export interface Kod {
  /** main() gövdesi. */
  govde: string;
  /** main() üstündeki fonksiyon tanımları. Bölme kapalıysa boş. */
  fonksiyonlar: string;
}

// ---------------------------------------------------------------- yürütme

export type Degiskenler = Readonly<Record<string, number | boolean>>;

export type Olay = 'ilerle' | 'don' | 'kap' | 'carpma' | 'giris' | 'cikis';

/** Editörün iki düzenlenebilir bölmesi. */
export type Bolme = 'govde' | 'fonksiyon';

/**
 * Yürütmenin tek bir karesi. Arayüz bu diziyi sırayla oynatır:
 * ızgara animasyonu, aktif satır vurgusu ve değişken paneli
 * hepsi aynı akıştan beslenir.
 */
export interface Adim {
  /** Adımın hangi bölmede olduğu. */
  bolme: Bolme;
  /** O bölmedeki 1 tabanlı satır. */
  satir: number;
  durum: Durum;
  degiskenler: Degiskenler;
  olay?: Olay;
}

export type HataKodu =
  | 'sozdizimi'
  | 'noktali-virgul-eksik'
  | 'parantez-kapanmadi'
  | 'bilinmeyen-ad'
  | 'desteklenmeyen'
  | 'izinsiz-komut'
  | 'izinsiz-yapi'
  | 'palete-carptin'
  | 'disari-ciktin'
  | 'bos-kare-kap'
  | 'sonsuz-dongu'
  | 'cikolata-kaldi'
  | 'molaya-varmadi';

export interface Hata {
  kod: HataKodu;
  bolme: Bolme;
  /** Öğrenciye gösterilen Türkçe metin. Ne oldu, nerede, ne denenebilir. */
  mesaj: string;
  /** 1 tabanlı satır. Satırı bilinmeyen hatalarda 0. */
  satir: number;
}

export interface CalismaSonucu {
  basarili: boolean;
  adimlar: readonly Adim[];
  hata?: Hata;
  /** Boş satırlar ve yalnız parantez içeren satırlar sayılmaz. */
  kullanilanSatir: number;
  yildiz: 0 | 1 | 2 | 3;
}

// ---------------------------------------------------------------- ilerleme

export interface BolumIlerleme {
  no: number;
  yildiz: 0 | 1 | 2 | 3;
  acik: boolean;
}

// ---------------------------------------------------------------- panel props

export interface UstBarProps {
  bolumNo: number;
  toplamBolum: number;
  vardiya: 1 | 2 | 3 | 4;
  toplamYildiz: number;
  enFazlaYildiz: number;
  onHaritaAc: () => void;
}

export interface GorevKartiProps {
  bolumNo: number;
  ad: string;
  kavram: string;
  gorev: string;
}

export interface KomutListesiProps {
  izinliKomutlar: readonly KomutAdi[];
  izinliYapilar: readonly YapiAdi[];
}

export interface IpucuPaneliProps {
  ipuclari: readonly [string, string];
  /** 0 = hiçbiri açık değil. */
  acikSayisi: 0 | 1 | 2;
  onAc: () => void;
}

export interface VardiyaSonuProps {
  bolumNo: number;
  ad: string;
  yildiz: 1 | 2 | 3;
  kullanilanSatir: number;
  hedefSatir: number;
  vardiyaNotu: string;
  cantada: number;
  sonBolumMu: boolean;
  onSonraki: () => void;
  onTekrar: () => void;
}

export interface BolumHaritasiProps {
  bolumler: readonly BolumIlerleme[];
  suAnki: number;
  onSec: (no: number) => void;
  onKapat: () => void;
}
