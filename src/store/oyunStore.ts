import { create } from 'zustand';
import { BOLUMLER, TOPLAM_BOLUM } from '../levels';
import { calistir } from '../core/yurutucu';
import type { Adim, Bolum, CalismaSonucu, Kod } from '../core/types';

const KAYIT = 'sezeritma.ilerleme.v1';

interface Kayit {
  yildizlar: Record<number, 0 | 1 | 2 | 3>;
  kodlar: Record<number, Kod>;
}

const bosKayit: Kayit = { yildizlar: {}, kodlar: {} };

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

/** En yüksek açık bölüm: bir öncekini geçtiysen sonraki açılır. */
const acikMi = (no: number, yildizlar: Kayit['yildizlar']) =>
  no === 1 || (yildizlar[no - 1] ?? 0) > 0;

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
}

const ilkKayit = kayitOku();
const ilkBolum =
  BOLUMLER.find((b) => (ilkKayit.yildizlar[b.no] ?? 0) === 0 && acikMi(b.no, ilkKayit.yildizlar)) ??
  BOLUMLER[0];

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

  kodYaz: (parca) => {
    const kod = { ...get().kod, ...parca };
    const kayit = kayitOku();
    kayitYaz({ ...kayit, kodlar: { ...kayit.kodlar, [get().bolum.no]: kod } });
    set({ kod, adimlar: [], adimIndex: -1, oynatiliyor: false, sonuc: null });
  },

  calistirBasla: () => {
    const { kod, bolum, ipucuKullanildi } = get();
    const sonuc = calistir(kod, bolum, { ipucuKullanildi });
    set({ sonuc, adimlar: sonuc.adimlar, adimIndex: -1, oynatiliyor: sonuc.adimlar.length > 0 });
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
    });
  },

  sonrakiBolum: () => {
    const sonraki = get().bolum.no + 1;
    if (sonraki > TOPLAM_BOLUM) {
      set({ basariAcik: false, haritaAcik: true });
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
}));

export const bolumAcik = acikMi;
