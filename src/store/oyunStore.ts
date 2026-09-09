import { create } from 'zustand';
import { BOLUMLER, TOPLAM_BOLUM } from '../levels';
import { calistir } from '../core/yurutucu';
import { dersBul } from '../content/dersler';
import { sonucTuru, type TahminTuru } from '../content/tahmin';
import type { Adim, Bolum, CalismaSonucu, Kod, KomutAdi } from '../core/types';

const KAYIT = 'sezeritma.ilerleme.v1';

const SATIR_SONU = String.fromCharCode(10);

/** Kart modunda gövde, boş satır barındırmayan düz bir komut listesidir. */
const kartSatirlari = (govde: string): string[] =>
  govde.split(SATIR_SONU).filter((l) => l.trim().length > 0);

interface Kayit {
  yildizlar: Record<number, 0 | 1 | 2 | 3>;
  kodlar: Record<number, Kod>;
  /** Gösterilmiş ders kartları. Aynı ders iki kere zorla açılmaz. */
  gorulenDersler: number[];
  /** Karşılama ekranı bir kere gösterilir. */
  karsilamaGorundu?: boolean;
  /** Tahmin şeridini kapatan öğrenciye bir daha gösterilmez. */
  tahminKapali?: boolean;
  /**
   * Karşılamada seçilen giriş seviyesi. Kod bilen biri baştan başlamak
   * zorunda kalmasın diye buraya kadar olan bölümler açık gelir.
   */
  enYuksekAcik?: number;
}

const bosKayit: Kayit = { yildizlar: {}, kodlar: {}, gorulenDersler: [] };

const kayitOku = (): Kayit => {
  try {
    const ham = localStorage.getItem(KAYIT);
    if (!ham) return bosKayit;
    return { ...bosKayit, ...(JSON.parse(ham) as Kayit) };
  } catch {
    return bosKayit;
  }
};

const kayitYaz = (kayit: Kayit) => {
  try {
    localStorage.setItem(KAYIT, JSON.stringify(kayit));
  } catch {
    /* gizli sekmede yazamayabiliriz, oyun yine de çalışsın */
  }
};

const baslangicKodu = (bolum: Bolum, kayit: Kayit): Kod =>
  kayit.kodlar[bolum.no] ?? { govde: bolum.baslangicKodu, fonksiyonlar: '' };

/**
 * Bir bölüm açık mı? İki yoldan biriyle açılır: öncekini geçmişsindir,
 * ya da karşılamada "bunu zaten biliyorum" diyerek oraya kadar atlamışsındır.
 */
const acikMi = (no: number, yildizlar: Kayit['yildizlar'], enYuksekAcik = 1) =>
  no <= Math.max(1, enYuksekAcik) || (yildizlar[no - 1] ?? 0) > 0;

interface OyunDurumu {
  bolum: Bolum;
  kod: Kod;
  yildizlar: Record<number, 0 | 1 | 2 | 3>;

  adimlar: readonly Adim[];
  adimIndex: number;
  oynatiliyor: boolean;
  hiz: number;
  sonuc: CalismaSonucu | null;

  ipucuAcik: 0 | 1 | 2;
  ipucuKullanildi: boolean;
  basariAcik: boolean;
  haritaAcik: boolean;
  dersAcik: boolean;
  kavramlarAcik: boolean;
  /** Kart modu açıkken öğrenci klavye yerine komut kartlarıyla kod kuruyor. */
  kartlaYaz: boolean;
  /** Türkçe okuma paneli açık mı. */
  turkceAcik: boolean;
  gorulenDersler: number[];
  karsilamaAcik: boolean;
  bitisAcik: boolean;
  /** Karşılamada seçilen giriş seviyesi. */
  enYuksekAcik: number;
  /** Çalıştırmadan önce seçilen tahmin. */
  tahmin: TahminTuru | null;
  /** Son çalıştırmanın gerçek sonucu. Tahminle karşılaştırılır. */
  gercekSonuc: TahminTuru | null;
  tahminKapali: boolean;

  kodYaz: (kod: Partial<Kod>) => void;
  calistirBasla: () => void;
  duraklat: () => void;
  devamEt: () => void;
  ileriAl: () => void;
  sifirla: () => void;
  tik: () => void;
  bolumSec: (no: number) => void;
  sonrakiBolum: () => void;
  ipucuAc: () => void;
  haritaAcKapa: (acik: boolean) => void;
  basariKapat: () => void;
  dersAc: () => void;
  dersKapat: () => void;
  kavramlarAcKapa: (acik: boolean) => void;
  kartEkle: (komut: KomutAdi) => void;
  kartGeriAl: () => void;
  kartTemizle: () => void;
  kartlaYazDegistir: (kartla: boolean) => void;
  turkceAcKapa: (acik: boolean) => void;
  karsilamayiBitir: (baslangicBolumu?: number) => void;
  karsilamayiAc: () => void;
  bitisKapat: () => void;
  tahminSec: (tur: TahminTuru) => void;
  tahminiKapat: () => void;
}

/** Ders kartı sadece o bölümde yeni bir kavram varsa ve daha önce görülmediyse açılır. */
const dersGosterilsinMi = (bolumNo: number, gorulen: number[]) => {
  const vardiyaBasi = [1, 6, 11, 17, 23, 27].includes(bolumNo);
  return (dersBul(bolumNo) !== undefined || vardiyaBasi) && !gorulen.includes(bolumNo);
};

const ilkKayit = kayitOku();
const ilkBolum =
  BOLUMLER.find(
    (b) =>
      (ilkKayit.yildizlar[b.no] ?? 0) === 0 &&
      acikMi(b.no, ilkKayit.yildizlar, ilkKayit.enYuksekAcik),
  ) ?? BOLUMLER[0];

export const useOyun = create<OyunDurumu>((set, get) => ({
  bolum: ilkBolum,
  kod: baslangicKodu(ilkBolum, ilkKayit),
  yildizlar: ilkKayit.yildizlar,

  adimlar: [],
  adimIndex: -1,
  oynatiliyor: false,
  hiz: 3,
  sonuc: null,

  ipucuAcik: 0,
  ipucuKullanildi: false,
  basariAcik: false,
  haritaAcik: false,
  dersAcik: dersGosterilsinMi(ilkBolum.no, ilkKayit.gorulenDersler),
  kavramlarAcik: false,
  kartlaYaz: ilkBolum.kartModu,
  turkceAcik: false,
  gorulenDersler: ilkKayit.gorulenDersler,
  karsilamaAcik: !ilkKayit.karsilamaGorundu,
  bitisAcik: false,
  enYuksekAcik: ilkKayit.enYuksekAcik ?? 1,
  tahmin: null,
  gercekSonuc: null,
  tahminKapali: ilkKayit.tahminKapali === true,

  kodYaz: (parca) => {
    const kod = { ...get().kod, ...parca };
    const kayit = kayitOku();
    kayitYaz({ ...kayit, kodlar: { ...kayit.kodlar, [get().bolum.no]: kod } });
    set({ kod, adimlar: [], adimIndex: -1, oynatiliyor: false, sonuc: null, gercekSonuc: null });
  },

  calistirBasla: () => {
    const { kod, bolum, ipucuKullanildi } = get();
    const sonuc = calistir(kod, bolum, { ipucuKullanildi });
    set({
      sonuc,
      gercekSonuc: sonucTuru(sonuc),
      adimlar: sonuc.adimlar,
      adimIndex: -1,
      oynatiliyor: sonuc.adimlar.length > 0,
    });
    if (sonuc.adimlar.length === 0) get().tik();
  },

  duraklat: () => set({ oynatiliyor: false }),
  devamEt: () => set({ oynatiliyor: get().adimIndex < get().adimlar.length - 1 }),

  ileriAl: () => {
    const { adimlar, adimIndex, sonuc } = get();
    if (!sonuc) {
      get().calistirBasla();
      set({ oynatiliyor: false });
      return;
    }
    if (adimIndex < adimlar.length - 1) set({ adimIndex: adimIndex + 1, oynatiliyor: false });
    else get().tik();
  },

  /** Oynatma zamanlayıcısının her vuruşu. */
  tik: () => {
    const { adimlar, adimIndex, sonuc, bolum, yildizlar } = get();

    if (adimIndex < adimlar.length - 1) {
      set({ adimIndex: adimIndex + 1 });
      return;
    }

    set({ oynatiliyor: false });
    if (!sonuc?.basarili) return;

    const oncekiYildiz = yildizlar[bolum.no] ?? 0;
    const yeni = { ...yildizlar, [bolum.no]: Math.max(oncekiYildiz, sonuc.yildiz) as 0 | 1 | 2 | 3 };
    const kayit = kayitOku();
    kayitYaz({ ...kayit, yildizlar: yeni });
    set({ yildizlar: yeni, basariAcik: true });
  },

  sifirla: () =>
    set({ adimlar: [], adimIndex: -1, oynatiliyor: false, sonuc: null }),

  bolumSec: (no) => {
    const bolum = BOLUMLER.find((b) => b.no === no);
    if (!bolum) return;
    const kayit = kayitOku();
    set({
      bolum,
      kod: baslangicKodu(bolum, kayit),
      adimlar: [],
      adimIndex: -1,
      oynatiliyor: false,
      sonuc: null,
      ipucuAcik: 0,
      ipucuKullanildi: false,
      basariAcik: false,
      haritaAcik: false,
      kavramlarAcik: false,
      kartlaYaz: bolum.kartModu,
      turkceAcik: false,
      tahmin: null,
      gercekSonuc: null,
      bitisAcik: false,
      dersAcik: dersGosterilsinMi(no, kayit.gorulenDersler),
    });
  },

  sonrakiBolum: () => {
    const sonraki = get().bolum.no + 1;
    if (sonraki > TOPLAM_BOLUM) {
      const hepsiGecildi = BOLUMLER.every((b) => (get().yildizlar[b.no] ?? 0) > 0);
      set({ basariAcik: false, bitisAcik: hepsiGecildi, haritaAcik: !hepsiGecildi });
      return;
    }
    get().bolumSec(sonraki);
  },

  ipucuAc: () => {
    const acik = Math.min(2, get().ipucuAcik + 1) as 0 | 1 | 2;
    set({ ipucuAcik: acik, ipucuKullanildi: true });
  },

  haritaAcKapa: (haritaAcik) => set({ haritaAcik }),
  basariKapat: () => set({ basariAcik: false }),

  dersAc: () => set({ dersAcik: true }),

  dersKapat: () => {
    const no = get().bolum.no;
    const gorulen = get().gorulenDersler.includes(no)
      ? get().gorulenDersler
      : [...get().gorulenDersler, no];
    const kayit = kayitOku();
    kayitYaz({ ...kayit, gorulenDersler: gorulen });
    set({ dersAcik: false, gorulenDersler: gorulen });
  },

  kavramlarAcKapa: (kavramlarAcik) => set({ kavramlarAcik }),

  kartEkle: (komut) => {
    const satirlar = kartSatirlari(get().kod.govde);
    satirlar.push(`${komut}();`);
    get().kodYaz({ govde: satirlar.join(SATIR_SONU) });
  },

  kartGeriAl: () => {
    const satirlar = kartSatirlari(get().kod.govde);
    satirlar.pop();
    get().kodYaz({ govde: satirlar.join(SATIR_SONU) });
  },

  kartTemizle: () => get().kodYaz({ govde: '' }),

  kartlaYazDegistir: (kartlaYaz) => set({ kartlaYaz }),

  turkceAcKapa: (turkceAcik) => set({ turkceAcik }),

  karsilamayiAc: () => set({ karsilamaAcik: true, haritaAcik: false }),

  bitisKapat: () => set({ bitisAcik: false, haritaAcik: true }),

  tahminSec: (tahmin) => set({ tahmin }),

  tahminiKapat: () => {
    const kayit = kayitOku();
    kayitYaz({ ...kayit, tahminKapali: true });
    set({ tahminKapali: true });
  },

  karsilamayiBitir: (baslangicBolumu) => {
    const kayit = kayitOku();
    const enYuksekAcik = Math.max(kayit.enYuksekAcik ?? 1, baslangicBolumu ?? 1);
    kayitYaz({ ...kayit, karsilamaGorundu: true, enYuksekAcik });
    set({ karsilamaAcik: false, enYuksekAcik });
    if (baslangicBolumu && baslangicBolumu > get().bolum.no) get().bolumSec(baslangicBolumu);
  },
}));

export const bolumAcik = acikMi;
