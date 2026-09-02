import { ayristir } from './parser';
import { CalismaHatasi, DerlemeHatasi } from './hatalar';
import {
  baslangicDurumu,
  bolumTamamMi,
  dunyaKur,
  ilerle as dunyaIlerle,
  kap as dunyaKap,
  molaOdasindaMi,
  onumdePalet,
  sagaDon,
  solaDon,
  ustumdeCikolata,
  type Dunya,
} from './dunya';
import type { Blok, Dugum, FonksiyonTanim, Ifade, Konum, Program } from './ast';
import {
  KOMUTLAR,
  type Adim,
  type Bolum,
  type CalismaSonucu,
  type Degiskenler,
  type Durum,
  type Hata,
  type Kod,
  type KomutAdi,
  type YapiAdi,
} from './types';

/** Adım bütçesi. Aşılınca sonsuz döngü olarak raporlanır. */
const ADIM_SINIRI = 20_000;
const CAGRI_DERINLIGI = 60;

const KOMUT_SETI = new Set<string>(KOMUTLAR);

// ------------------------------------------------------------------ yardımcılar

/** Öğrencinin yazım hatasına en yakın gerçek ismi bulur. */
function enYakinIsim(yazilan: string, adaylar: string[]): string | undefined {
  let enIyi: string | undefined;
  let enIyiMesafe = Infinity;
  for (const aday of adaylar) {
    const m = mesafe(yazilan.toLowerCase(), aday.toLowerCase());
    if (m < enIyiMesafe) {
      enIyiMesafe = m;
      enIyi = aday;
    }
  }
  return enIyiMesafe <= Math.max(2, Math.floor(yazilan.length / 3)) ? enIyi : undefined;
}

function mesafe(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[a.length][b.length];
}

/** Boş satırlar ve yalnızca parantez içeren satırlar sayılmaz. */
export function satirSay(kod: Kod): number {
  const say = (metin: string) =>
    metin
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/^[{}();]+$/.test(s)).length;
  return say(kod.govde) + say(kod.fonksiyonlar);
}

// ------------------------------------------------------------------ ön denetim

const YAPI_ADI: Record<YapiAdi, string> = {
  for: '`for` döngüsü',
  while: '`while` döngüsü',
  if: '`if` koşulu',
  else: '`else` dalı',
  degisken: 'değişken tanımı',
  fonksiyon: 'kendi fonksiyonun',
};

function denetle(program: Program, bolum: Bolum): Hata | undefined {
  const izinliKomut = new Set<string>(bolum.izinliKomutlar);
  const izinliYapi = new Set<string>(bolum.izinliYapilar);
  const fonksiyonAdlari = program.fonksiyonlar.map((f) => f.ad);
  let hata: Hata | undefined;

  const yapiGerek = (yapi: YapiAdi, konum: Konum) => {
    if (hata || izinliYapi.has(yapi)) return;
    hata = {
      kod: 'izinsiz-yapi',
      bolme: konum.bolme,
      satir: konum.satir,
      mesaj: `${konum.satir}. satırda ${YAPI_ADI[yapi]} kullanmışsın ama bu bölümde ${yapi} henüz açılmadı. Elindeki komutlarla çözebilirsin.`,
    };
  };

  const adDenetle = (ad: string, konum: Konum) => {
    if (hata) return;
    if (fonksiyonAdlari.includes(ad)) return;
    if (KOMUT_SETI.has(ad)) {
      if (izinliKomut.has(ad as KomutAdi)) return;
      hata = {
        kod: 'izinsiz-komut',
        bolme: konum.bolme,
        satir: konum.satir,
        mesaj: `${konum.satir}. satırda \`${ad}()\` kullanmışsın ama bu bölümde o komut henüz açılmadı. Sağdaki listede olanlarla çözebilirsin.`,
      };
      return;
    }
    const oneri = enYakinIsim(ad, [...bolum.izinliKomutlar, ...fonksiyonAdlari]);
    hata = {
      kod: 'bilinmeyen-ad',
      bolme: konum.bolme,
      satir: konum.satir,
      mesaj: oneri
        ? `${konum.satir}. satırda \`${ad}\` diye bir komut yok. \`${oneri}\` mi demek istedin?`
        : `${konum.satir}. satırda \`${ad}\` diye bir komut yok. Sağdaki komut listesine bakabilirsin.`,
    };
  };

  const ifadeGez = (i: Ifade) => {
    if (i.tip === 'sorgu') adDenetle(i.ad, i);
    else if (i.tip === 'tekli') ifadeGez(i.operand);
    else if (i.tip === 'ikili') {
      ifadeGez(i.sol);
      ifadeGez(i.sag);
    }
  };

  const gez = (d: Dugum) => {
    if (hata) return;
    switch (d.tip) {
      case 'blok':
        d.govde.forEach(gez);
        break;
      case 'cagri':
        adDenetle(d.ad, d);
        break;
      case 'tanim':
        yapiGerek('degisken', d);
        ifadeGez(d.deger);
        break;
      case 'atama':
        ifadeGez(d.deger);
        break;
      case 'for':
        yapiGerek('for', d);
        gez(d.baslangic);
        ifadeGez(d.kosul);
        gez(d.artis);
        gez(d.govde);
        break;
      case 'while':
        yapiGerek('while', d);
        ifadeGez(d.kosul);
        gez(d.govde);
        break;
      case 'if':
        yapiGerek('if', d);
        if (d.degilse) yapiGerek('else', d);
        ifadeGez(d.kosul);
        gez(d.govde);
        if (d.degilse) gez(d.degilse);
        break;
      default:
        break;
    }
  };

  if (program.fonksiyonlar.length > 0) {
    yapiGerek('fonksiyon', program.fonksiyonlar[0]);
  }
  program.fonksiyonlar.forEach((f) => gez(f.govde));
  gez(program.main);
  return hata;
}

// ------------------------------------------------------------------ yürütme

class Durduruldu extends Error {}

class Yurutucu {
  private durum: Durum;
  private readonly adimlar: Adim[] = [];
  private readonly kapsamlar: Map<string, number | boolean>[] = [new Map()];
  private readonly fonksiyonlar = new Map<string, FonksiyonTanim>();
  private butce = ADIM_SINIRI;
  private derinlik = 0;
  private sonDonguKonumu: Konum | null = null;

  constructor(
    private readonly program: Program,
    private readonly dunya: Dunya,
    bolum: Bolum,
  ) {
    this.durum = baslangicDurumu(
      {
        izgara: bolum.izgara,
        paletler: [...bolum.paletler],
        cikolatalar: [...bolum.cikolatalar],
        mola: bolum.mola,
        baslangicKare: bolum.baslangic.kare,
      },
      bolum.baslangic.yon,
    );
    program.fonksiyonlar.forEach((f) => this.fonksiyonlar.set(f.ad, f));
  }

  calis(): { adimlar: Adim[]; durum: Durum; hata?: Hata } {
    try {
      this.blok(this.program.main);
    } catch (h) {
      if (h instanceof Durduruldu) {
        const konum = this.sonDonguKonumu;
        return {
          adimlar: this.adimlar,
          durum: this.durum,
          hata: {
            kod: 'sonsuz-dongu',
            bolme: konum?.bolme ?? 'govde',
            satir: konum?.satir ?? 0,
            mesaj:
              'Kodun hiç bitmedi, sonsuz döngüye girdin. `while` koşulun ne zaman yanlış olacak — koşulu yanlış yapacak bir şey oluyor mu döngünün içinde?',
          },
        };
      }
      if (h instanceof CalismaHatasi) {
        return {
          adimlar: this.adimlar,
          durum: this.durum,
          hata: { kod: h.kod, bolme: h.bolme, satir: h.satir, mesaj: h.mesaj },
        };
      }
      throw h;
    }
    return { adimlar: this.adimlar, durum: this.durum };
  }

  // ---------------------------------------------------------- kapsam

  private degiskenAta(ad: string, deger: number | boolean, konum: Konum): void {
    for (let i = this.kapsamlar.length - 1; i >= 0; i--) {
      if (this.kapsamlar[i].has(ad)) {
        this.kapsamlar[i].set(ad, deger);
        return;
      }
    }
    throw new CalismaHatasi(
      'bilinmeyen-ad',
      `${konum.satir}. satırda \`${ad}\` diye bir değişken yok. Önce \`int ${ad} = 0;\` diye tanımlaman gerekiyor.`,
      konum.satir,
      konum.bolme,
    );
  }

  private degiskenOku(ad: string, konum: Konum): number | boolean {
    for (let i = this.kapsamlar.length - 1; i >= 0; i--) {
      const v = this.kapsamlar[i].get(ad);
      if (v !== undefined) return v;
    }
    throw new CalismaHatasi(
      'bilinmeyen-ad',
      `${konum.satir}. satırda \`${ad}\` diye bir değişken yok. Önce \`int ${ad} = 0;\` diye tanımlaman gerekiyor.`,
      konum.satir,
      konum.bolme,
    );
  }

  private degiskenlerSnapshot(): Degiskenler {
    const hepsi: Record<string, number | boolean> = {};
    for (const kapsam of this.kapsamlar) {
      for (const [k, v] of kapsam) hepsi[k] = v;
    }
    return hepsi;
  }

  // ---------------------------------------------------------- adım

  private adimEkle(konum: Konum, olay?: Adim['olay']): void {
    if (--this.butce <= 0) throw new Durduruldu();
    this.adimlar.push({
      bolme: konum.bolme,
      satir: konum.satir,
      durum: this.durum,
      degiskenler: this.degiskenlerSnapshot(),
      olay,
    });
  }

  // ---------------------------------------------------------- deyimler

  private blok(b: Blok): void {
    this.kapsamlar.push(new Map());
    try {
      for (const d of b.govde) this.deyim(d);
    } finally {
      this.kapsamlar.pop();
    }
  }

  private deyim(d: Dugum): void {
    switch (d.tip) {
      case 'blok':
        this.blok(d);
        return;

      case 'cagri':
        this.cagriYap(d.ad, d);
        return;

      case 'tanim': {
        const deger = this.ifade(d.deger);
        this.kapsamlar[this.kapsamlar.length - 1].set(d.ad, deger);
        this.adimEkle(d);
        return;
      }

      case 'atama': {
        const deger = this.ifade(d.deger);
        this.degiskenAta(d.ad, deger, d);
        this.adimEkle(d);
        return;
      }

      case 'for': {
        this.sonDonguKonumu = d;
        this.kapsamlar.push(new Map());
        try {
          this.deyimSessiz(d.baslangic);
          while (true) {
            this.adimEkle(d);
            if (!this.dogruMu(this.ifade(d.kosul))) break;
            this.blok(d.govde);
            this.deyimSessiz(d.artis);
          }
        } finally {
          this.kapsamlar.pop();
        }
        return;
      }

      case 'while': {
        this.sonDonguKonumu = d;
        while (true) {
          this.adimEkle(d);
          if (!this.dogruMu(this.ifade(d.kosul))) break;
          this.blok(d.govde);
        }
        return;
      }

      case 'if': {
        this.adimEkle(d);
        if (this.dogruMu(this.ifade(d.kosul))) this.blok(d.govde);
        else if (d.degilse) this.deyim(d.degilse);
        return;
      }

      case 'return':
        this.adimEkle(d);
        return;
    }
  }

  /** for başlığındaki tanım ve artış: kendi adımını üretmez. */
  private deyimSessiz(d: Dugum): void {
    if (d.tip === 'tanim') {
      this.kapsamlar[this.kapsamlar.length - 1].set(d.ad, this.ifade(d.deger));
      return;
    }
    if (d.tip === 'atama') {
      this.degiskenAta(d.ad, this.ifade(d.deger), d);
      return;
    }
    this.deyim(d);
  }

  private cagriYap(ad: string, konum: Konum): void {
    const fonksiyon = this.fonksiyonlar.get(ad);
    if (fonksiyon) {
      if (++this.derinlik > CAGRI_DERINLIGI) throw new Durduruldu();
      this.adimEkle(konum, 'giris');
      this.blok(fonksiyon.govde);
      this.derinlik--;
      return;
    }

    switch (ad as KomutAdi) {
      case 'ilerle':
        this.durum = dunyaIlerle(this.durum, this.dunya, konum);
        this.adimEkle(konum, 'ilerle');
        return;
      case 'sagaDon':
        this.durum = sagaDon(this.durum);
        this.adimEkle(konum, 'don');
        return;
      case 'solaDon':
        this.durum = solaDon(this.durum);
        this.adimEkle(konum, 'don');
        return;
      case 'kap':
        this.durum = dunyaKap(this.durum, this.dunya, konum);
        this.adimEkle(konum, 'kap');
        return;
      default:
        throw new CalismaHatasi(
          'bilinmeyen-ad',
          `${konum.satir}. satırda \`${ad}\` diye bir komut yok.`,
          konum.satir,
          konum.bolme,
        );
    }
  }

  // ---------------------------------------------------------- ifadeler

  private dogruMu(v: number | boolean): boolean {
    return typeof v === 'boolean' ? v : v !== 0;
  }

  private sayiya(v: number | boolean): number {
    return typeof v === 'number' ? v : v ? 1 : 0;
  }

  private ifade(i: Ifade): number | boolean {
    switch (i.tip) {
      case 'sayi':
      case 'dogruluk':
        return i.deger;
      case 'degisken':
        return this.degiskenOku(i.ad, i);
      case 'sorgu':
        return this.sorgu(i.ad, i);
      case 'tekli': {
        const v = this.ifade(i.operand);
        return i.op === '!' ? !this.dogruMu(v) : -this.sayiya(v);
      }
      case 'ikili':
        return this.ikili(i);
    }
  }

  private ikili(i: Extract<Ifade, { tip: 'ikili' }>): number | boolean {
    if (i.op === '&&') return this.dogruMu(this.ifade(i.sol)) && this.dogruMu(this.ifade(i.sag));
    if (i.op === '||') return this.dogruMu(this.ifade(i.sol)) || this.dogruMu(this.ifade(i.sag));

    const sol = this.ifade(i.sol);
    const sag = this.ifade(i.sag);

    switch (i.op) {
      case '==':
        return sol === sag;
      case '!=':
        return sol !== sag;
      case '<':
        return this.sayiya(sol) < this.sayiya(sag);
      case '>':
        return this.sayiya(sol) > this.sayiya(sag);
      case '<=':
        return this.sayiya(sol) <= this.sayiya(sag);
      case '>=':
        return this.sayiya(sol) >= this.sayiya(sag);
      case '+':
        return this.sayiya(sol) + this.sayiya(sag);
      case '-':
        return this.sayiya(sol) - this.sayiya(sag);
      case '*':
        return this.sayiya(sol) * this.sayiya(sag);
      case '/': {
        const b = this.sayiya(sag);
        if (b === 0) {
          throw new CalismaHatasi(
            'sozdizimi',
            `${i.satir}. satırda sıfıra bölme var. Bölen sıfır olamaz.`,
            i.satir,
            i.bolme,
          );
        }
        return Math.trunc(this.sayiya(sol) / b);
      }
      case '%':
        return this.sayiya(sol) % this.sayiya(sag);
      default:
        throw new CalismaHatasi(
          'desteklenmeyen',
          `${i.satir}. satırdaki \`${i.op}\` işlecini bu oyunda kullanamıyorsun.`,
          i.satir,
          i.bolme,
        );
    }
  }

  private sorgu(ad: string, konum: Konum): boolean {
    switch (ad as KomutAdi) {
      case 'molaOdasindaMiyim':
        return molaOdasindaMi(this.durum, this.dunya);
      case 'onumdePaletVar':
        return onumdePalet(this.durum, this.dunya);
      case 'ustumdeCikolataVar':
        return ustumdeCikolata(this.durum);
      default:
        throw new CalismaHatasi(
          'bilinmeyen-ad',
          `${konum.satir}. satırda \`${ad}\` diye bir şey yok.`,
          konum.satir,
          konum.bolme,
        );
    }
  }
}

// ------------------------------------------------------------------ giriş noktası

export interface CalistirmaSecenekleri {
  ipucuKullanildi?: boolean;
}

export function calistir(
  kod: Kod,
  bolum: Bolum,
  secenekler: CalistirmaSecenekleri = {},
): CalismaSonucu {
  const kullanilanSatir = satirSay(kod);
  const basarisiz = (hata: Hata, adimlar: readonly Adim[] = []): CalismaSonucu => ({
    basarili: false,
    adimlar,
    hata,
    kullanilanSatir,
    yildiz: 0,
  });

  let program: Program;
  try {
    program = ayristir(kod.govde, kod.fonksiyonlar);
  } catch (h) {
    if (h instanceof DerlemeHatasi) {
      return basarisiz({ kod: h.kod, bolme: h.bolme, satir: h.satir, mesaj: h.mesaj });
    }
    throw h;
  }

  const denetimHatasi = denetle(program, bolum);
  if (denetimHatasi) return basarisiz(denetimHatasi);

  const dunya = dunyaKur({
    izgara: bolum.izgara,
    paletler: [...bolum.paletler],
    cikolatalar: [...bolum.cikolatalar],
    mola: bolum.mola,
    baslangicKare: bolum.baslangic.kare,
  });

  const { adimlar, durum, hata } = new Yurutucu(program, dunya, bolum).calis();
  if (hata) return basarisiz(hata, adimlar);

  if (!bolumTamamMi(durum, dunya)) {
    const kalan = durum.kalanCikolatalar.length;
    if (molaOdasindaMi(durum, dunya)) {
      return basarisiz(
        {
          kod: 'cikolata-kaldi',
          bolme: 'govde',
          satir: 0,
          mesaj: `Mola odasına ulaştın ama depoda ${kalan} çikolata kaldı. Vardiya bitmeden hepsini toplaman gerekiyor.`,
        },
        adimlar,
      );
    }
    return basarisiz(
      {
        kod: 'molaya-varmadi',
        bolme: 'govde',
        satir: 0,
        mesaj:
          kalan > 0
            ? `Kodun bitti ama Sezer mola odasına varamadı ve depoda ${kalan} çikolata kaldı.`
            : 'Kodun bitti ama Sezer mola odasına varamadı. Vardiya bitmeden oraya ulaşması gerekiyor.',
      },
      adimlar,
    );
  }

  const yildiz = (1 +
    (secenekler.ipucuKullanildi ? 0 : 1) +
    (kullanilanSatir <= bolum.hedefSatir ? 1 : 0)) as 1 | 2 | 3;

  return { basarili: true, adimlar, kullanilanSatir, yildiz };
}
