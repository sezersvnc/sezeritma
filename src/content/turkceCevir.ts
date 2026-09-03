import { ayristir } from '../core/parser';
import { DerlemeHatasi } from '../core/hatalar';
import type { Blok, Dugum, Ifade } from '../core/ast';
import type { Kod } from '../core/types';

/**
 * Türkçe okuma.
 *
 * Öğrencinin kendi yazdığı C++'ı, satır satır Türkçe adımlara çevirir.
 * Amaç kodu değiştirmek değil, "burada gerçekte ne yazdım" sorusuna
 * cevap vermek. Kod okumayı öğrenmenin en kısa yolu, kodu kendi
 * dilinde okumaktır.
 */

export interface TurkceSatir {
  girinti: number;
  metin: string;
}

const KOMUT: Record<string, string> = {
  ilerle: 'bir kare ilerle',
  sagaDon: 'sağa dön',
  solaDon: 'sola dön',
  kap: 'bastığın karedeki çikolatayı al',
};

/** Koşullar "-sa/-se" ekiyle okunur ki cümle düzgün kurulsun. */
const SORGU_OLUMLU: Record<string, string> = {
  molaOdasindaMiyim: 'mola odasındaysan',
  onumdePaletVar: 'önünde palet varsa',
  ustumdeCikolataVar: 'bastığın karede çikolata varsa',
};

const SORGU_OLUMSUZ: Record<string, string> = {
  molaOdasindaMiyim: 'mola odasında değilsen',
  onumdePaletVar: 'önünde palet yoksa',
  ustumdeCikolataVar: 'bastığın karede çikolata yoksa',
};

/** Değer olarak okunan hali. */
const SORGU_DEGER: Record<string, string> = {
  molaOdasindaMiyim: 'mola odasında olman',
  onumdePaletVar: 'önünde palet olması',
  ustumdeCikolataVar: 'çikolata olması',
};

const KARSILASTIRMA: Record<string, string> = {
  '<': 'küçükse',
  '>': 'büyükse',
  '<=': 'küçük ya da eşitse',
  '>=': 'büyük ya da eşitse',
  '==': 'eşitse',
  '!=': 'farklıysa',
};

const ARITMETIK: Record<string, string> = {
  '+': 'artı',
  '-': 'eksi',
  '*': 'çarpı',
  '/': 'bölü',
  '%': 'modu',
};

/** Koşulları "-sa/-se" ekiyle, düzgün bir Türkçe cümle olarak okur. */
function kosulOku(i: Ifade, olumsuz = false): string {
  switch (i.tip) {
    case 'sayi':
      return String(i.deger);
    case 'dogruluk':
      return i.deger !== olumsuz ? 'her zaman' : 'hiçbir zaman';
    case 'degisken':
      return olumsuz ? `${i.ad} sıfırsa` : `${i.ad} sıfır değilse`;
    case 'sorgu':
      return (olumsuz ? SORGU_OLUMSUZ : SORGU_OLUMLU)[i.ad] ?? `${i.ad} doğruysa`;
    case 'tekli':
      return i.op === '!' ? kosulOku(i.operand, !olumsuz) : degerOku(i);
    case 'ikili': {
      if (i.op === '&&' || i.op === '||') {
        const baglac = (i.op === '&&') !== olumsuz ? 've' : 'ya da';
        return `${kosulOku(i.sol, olumsuz)} ${baglac} ${kosulOku(i.sag, olumsuz)}`;
      }
      if (KARSILASTIRMA[i.op]) {
        const ters: Record<string, string> = {
          '<': '>=', '>': '<=', '<=': '>', '>=': '<', '==': '!=', '!=': '==',
        };
        const op = olumsuz ? ters[i.op] : i.op;
        return `${degerOku(i.sol)} sayısı ${degerOku(i.sag)} değerinden ${KARSILASTIRMA[op]}`;
      }
      return degerOku(i);
    }
  }
}

/** Sayısal ifadeleri okur. */
function degerOku(i: Ifade): string {
  switch (i.tip) {
    case 'sayi':
      return String(i.deger);
    case 'dogruluk':
      return i.deger ? 'doğru' : 'yanlış';
    case 'degisken':
      return i.ad;
    case 'sorgu':
      return SORGU_DEGER[i.ad] ?? i.ad;
    case 'tekli':
      return i.op === '!' ? `${degerOku(i.operand)} değil` : `eksi ${degerOku(i.operand)}`;
    case 'ikili':
      return `${degerOku(i.sol)} ${ARITMETIK[i.op] ?? i.op} ${degerOku(i.sag)}`;
  }
}

/** `i++` gibi bir artışı sade Türkçeyle söyler. */
function atamaOku(ad: string, deger: Ifade): string {
  if (
    deger.tip === 'ikili' &&
    deger.sol.tip === 'degisken' &&
    deger.sol.ad === ad &&
    deger.sag.tip === 'sayi'
  ) {
    if (deger.op === '+') return `${ad} sayısını ${deger.sag.deger} artır`;
    if (deger.op === '-') return `${ad} sayısını ${deger.sag.deger} azalt`;
  }
  return `${ad} sayısını ${degerOku(deger)} yap`;
}

/** `for (int i = 0; i < N; i++)` kalıbını "N kere tekrarla" diye okur. */
function forOku(d: Extract<Dugum, { tip: 'for' }>): string {
  const basit =
    d.baslangic.tip === 'tanim' &&
    d.baslangic.deger.tip === 'sayi' &&
    d.baslangic.deger.deger === 0 &&
    d.kosul.tip === 'ikili' &&
    d.kosul.op === '<' &&
    d.kosul.sol.tip === 'degisken' &&
    d.kosul.sol.ad === d.baslangic.ad &&
    d.kosul.sag.tip === 'sayi';

  if (basit && d.kosul.tip === 'ikili' && d.kosul.sag.tip === 'sayi') {
    return `${d.kosul.sag.deger} kere şunları tekrarla:`;
  }
  return `${kosulOku(d.kosul)} şunları tekrarla:`;
}

function deyimOku(d: Dugum, girinti: number, cikti: TurkceSatir[]): void {
  const yaz = (metin: string, ek = 0) => cikti.push({ girinti: girinti + ek, metin });

  switch (d.tip) {
    case 'blok':
      d.govde.forEach((alt) => deyimOku(alt, girinti, cikti));
      return;

    case 'cagri':
      yaz(KOMUT[d.ad] ?? `kendi yazdığın ${d.ad} komutunu çalıştır`);
      return;

    case 'tanim':
      yaz(`${d.ad} adında bir sayı oluştur, başlangıç değeri ${degerOku(d.deger)}`);
      return;

    case 'atama':
      yaz(atamaOku(d.ad, d.deger));
      return;

    case 'for':
      yaz(forOku(d));
      deyimOku(d.govde, girinti + 1, cikti);
      return;

    case 'while':
      yaz(`${kosulOku(d.kosul)} şunları tekrarla:`);
      deyimOku(d.govde, girinti + 1, cikti);
      return;

    case 'if':
      yaz(`eğer ${kosulOku(d.kosul)} şunu yap:`);
      deyimOku(d.govde, girinti + 1, cikti);
      if (d.degilse) {
        if (d.degilse.tip === 'if') {
          yaz('yoksa:');
          deyimOku(d.degilse, girinti, cikti);
        } else {
          yaz('değilse şunu yap:');
          deyimOku(d.degilse, girinti + 1, cikti);
        }
      }
      return;

    case 'return':
      return;
  }
}

export interface TurkceOkuma {
  satirlar: TurkceSatir[];
  hata?: string;
}

export function turkceyeCevir(kod: Kod): TurkceOkuma {
  if (!kod.govde.trim() && !kod.fonksiyonlar.trim()) {
    return { satirlar: [], hata: 'Henüz kod yazmadın. Bir şeyler yaz, buraya Türkçesini çıkarayım.' };
  }

  try {
    const program = ayristir(kod.govde, kod.fonksiyonlar);
    const satirlar: TurkceSatir[] = [];

    program.fonksiyonlar.forEach((f) => {
      satirlar.push({ girinti: 0, metin: `${f.ad} komutun şunu yapar:` });
      deyimOku(f.govde as Blok, 1, satirlar);
      satirlar.push({ girinti: 0, metin: '' });
    });

    satirlar.push({ girinti: 0, metin: 'Program başlar:' });
    deyimOku(program.main, 1, satirlar);
    return { satirlar };
  } catch (h) {
    if (h instanceof DerlemeHatasi) {
      return { satirlar: [], hata: `Kodda bir sözdizimi hatası var, o yüzden çeviremiyorum. ${h.mesaj}` };
    }
    throw h;
  }
}
