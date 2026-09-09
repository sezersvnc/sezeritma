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

/**
 * `bool` olarak tanımlanan değişkenlerin adları.
 *
 * Koşulda geçen çıplak bir değişken, sayıysa "sıfır değilse", doğruluk
 * değeriyse "doğruysa" diye okunmalı. Tür bilgisi ağacın tanım düğümünde
 * duruyor; çeviri başlarken bir kere toplanıyor.
 */
let boolAdlari = new Set<string>();

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
      if (boolAdlari.has(i.ad)) return olumsuz ? `${i.ad} yanlışsa` : `${i.ad} doğruysa`;
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
        // Eşitlik "değerinden eşitse" diye okunamaz; kendi kalıbı var.
        if (op === '==') return `${degerOku(i.sol)}, ${degerOku(i.sag)} ise`;
        if (op === '!=') return `${degerOku(i.sol)}, ${degerOku(i.sag)} değilse`;
        return `${degerOku(i.sol)}, ${degerOku(i.sag)} değerinden ${KARSILASTIRMA[op]}`;
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
      if (i.op === '%') {
        return `${degerOku(i.sol)} sayısının ${degerOku(i.sag)} ile bölümünden kalan`;
      }
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

/**
 * `for (int i = 0; i < N; i++)` kalıbını "N kere tekrarla" diye okur.
 *
 * Sayaç gövdede kullanılıyorsa ya da kalıp bu değilse üç parçanın üçü de
 * yazılır: nereden başlıyor, ne zamana kadar sürüyor, her turda ne oluyor.
 * Yoksa öğrenci `for`u bir `while` sanıyor.
 */
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

  if (basit && d.kosul.tip === 'ikili' && d.kosul.sag.tip === 'sayi' && !sayacKullaniliyor(d)) {
    return `${d.kosul.sag.deger} kere şunları tekrarla:`;
  }

  const ad = d.baslangic.tip === 'tanim' ? d.baslangic.ad : null;
  const bas =
    d.baslangic.tip === 'tanim' ? degerOku(d.baslangic.deger) : null;
  const artis =
    d.artis.tip === 'atama' ? atamaOku(d.artis.ad, d.artis.deger) : null;

  const parcalar = [
    ad && bas !== null ? `${ad} sayacını ${bas} yap` : null,
    `${kosulOku(d.kosul)} şunları tekrarla`,
    artis ? `her turun sonunda ${artis}` : null,
  ].filter(Boolean);

  return `${parcalar.join(', ')}:`;
}

/** Sayaç gövdede geçiyorsa kısa okuma yanıltıcı olur, uzun hâli yazılır. */
function sayacKullaniliyor(d: Extract<Dugum, { tip: 'for' }>): boolean {
  if (d.baslangic.tip !== 'tanim') return false;
  const ad = d.baslangic.ad;
  const ifadeGez = (i: Ifade): boolean => {
    switch (i.tip) {
      case 'degisken':
        return i.ad === ad;
      case 'tekli':
        return ifadeGez(i.operand);
      case 'ikili':
        return ifadeGez(i.sol) || ifadeGez(i.sag);
      default:
        return false;
    }
  };
  const gez = (n: Dugum): boolean => {
    switch (n.tip) {
      case 'blok':
        return n.govde.some(gez);
      case 'cagri':
        return n.argumanlar.some(ifadeGez);
      case 'tanim':
      case 'atama':
        return n.ad === ad || ifadeGez(n.deger);
      case 'for':
        return ifadeGez(n.kosul) || gez(n.govde);
      case 'while':
        return ifadeGez(n.kosul) || gez(n.govde);
      case 'if':
        return ifadeGez(n.kosul) || gez(n.govde) || (n.degilse ? gez(n.degilse) : false);
      default:
        return false;
    }
  };
  return gez(d.govde);
}

/** Tek satırlık gövdede "şunu", birden fazlasında "şunları". */
function yapKalibi(govde: Dugum): string {
  const cok = govde.tip === 'blok' && govde.govde.length > 1;
  return cok ? 'şunları yap:' : 'şunu yap:';
}

function deyimOku(d: Dugum, girinti: number, cikti: TurkceSatir[], zincirde = false): void {
  const yaz = (metin: string, ek = 0) => cikti.push({ girinti: girinti + ek, metin });

  switch (d.tip) {
    case 'blok':
      d.govde.forEach((alt) => deyimOku(alt, girinti, cikti));
      return;

    case 'cagri': {
      if (KOMUT[d.ad]) {
        yaz(KOMUT[d.ad]);
        return;
      }
      const degerler = d.argumanlar.map(degerOku).join(', ');
      yaz(
        degerler
          ? `kendi yazdığın ${d.ad} komutunu ${degerler} değeriyle çalıştır`
          : `kendi yazdığın ${d.ad} komutunu çalıştır`,
      );
      return;
    }

    case 'tanim':
      yaz(
        d.tur === 'bool'
          ? `${d.ad} adında doğru/yanlış tutan bir kutu oluştur, başlangıçta ${degerOku(d.deger)}`
          : `${d.ad} adında bir sayı oluştur, başlangıç değeri ${degerOku(d.deger)}`,
      );
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
      yaz(`${zincirde ? 'değilse, eğer' : 'eğer'} ${kosulOku(d.kosul)} ${yapKalibi(d.govde)}`);
      deyimOku(d.govde, girinti + 1, cikti);
      if (d.degilse) {
        if (d.degilse.tip === 'if') {
          // else if: ayrı bir if gibi değil, aynı zincirin halkası olarak okunur.
          deyimOku(d.degilse, girinti, cikti, true);
        } else {
          yaz(`${zincirde ? 'hiçbiri değilse' : 'değilse'} ${yapKalibi(d.degilse)}`);
          deyimOku(d.degilse, girinti + 1, cikti);
        }
      }
      return;

    case 'return':
      return;
  }
}

/** Ağaçtaki bütün `bool` tanımlarının adlarını toplar. */
function boollariTopla(program: { main: Blok; fonksiyonlar: { govde: Blok }[] }): Set<string> {
  const adlar = new Set<string>();
  const gez = (d: Dugum): void => {
    switch (d.tip) {
      case 'blok':
        d.govde.forEach(gez);
        return;
      case 'tanim':
        if (d.tur === 'bool') adlar.add(d.ad);
        return;
      case 'for':
        gez(d.baslangic);
        gez(d.govde);
        return;
      case 'while':
        gez(d.govde);
        return;
      case 'if':
        gez(d.govde);
        if (d.degilse) gez(d.degilse);
        return;
      default:
    }
  };
  program.fonksiyonlar.forEach((f) => gez(f.govde));
  gez(program.main);
  return adlar;
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
    boolAdlari = boollariTopla(program);
    const satirlar: TurkceSatir[] = [];

    program.fonksiyonlar.forEach((f) => {
      satirlar.push({
        girinti: 0,
        metin: f.parametreler.length
          ? `${f.ad} komutun, verdiğin ${f.parametreler.join(' ve ')} değeriyle şunu yapar:`
          : `${f.ad} komutun şunu yapar:`,
      });
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
