import type { Kare } from './types';

export interface CozulmusHarita {
  izgara: { genislik: number; yukseklik: number };
  paletler: Kare[];
  cikolatalar: Kare[];
  mola: Kare;
  baslangicKare: Kare;
}

const SEMBOLLER = new Set(['#', '.', 'S', 'C', 'M']);

/**
 * Bölüm dosyalarındaki ASCII haritayı koordinatlara çevirir.
 * x sağa, y aşağı doğru artar; sol üst köşe (0, 0).
 */
export function haritaCoz(metin: string): CozulmusHarita {
  const satirlar = metin
    .split('\n')
    .map((s) => s.replace(/\r$/, '').trimEnd())
    .filter((s) => s.length > 0);

  if (satirlar.length < 3) {
    throw new Error('Harita en az 3 satır olmalı ve dört kenarı palet ile kapalı olmalı.');
  }

  const genislik = satirlar[0].length;
  const kotu = satirlar.findIndex((s) => s.length !== genislik);
  if (kotu !== -1) {
    throw new Error(
      `Haritanın bütün satırları aynı uzunlukta olmalı. ${kotu + 1}. satır ${satirlar[kotu].length} karakter, ilk satır ${genislik} karakter.`,
    );
  }

  const paletler: Kare[] = [];
  const cikolatalar: Kare[] = [];
  const baslangiclar: Kare[] = [];
  const molalar: Kare[] = [];

  satirlar.forEach((satir, y) => {
    [...satir].forEach((sembol, x) => {
      if (!SEMBOLLER.has(sembol)) {
        throw new Error(
          `Haritada tanımadığım bir sembol var: "${sembol}" (${y + 1}. satır, ${x + 1}. sütun). Sadece # . S C M kullanılabilir.`,
        );
      }
      if (sembol === '#') paletler.push({ x, y });
      if (sembol === 'C') cikolatalar.push({ x, y });
      if (sembol === 'S') baslangiclar.push({ x, y });
      if (sembol === 'M') molalar.push({ x, y });
    });
  });

  if (baslangiclar.length !== 1) {
    throw new Error(`Haritada tam olarak bir tane \`S\` olmalı, ${baslangiclar.length} tane var.`);
  }
  if (molalar.length !== 1) {
    throw new Error(`Haritada tam olarak bir tane \`M\` olmalı, ${molalar.length} tane var.`);
  }

  const yukseklik = satirlar.length;
  const acikKenar =
    satirlar[0].includes('.') ||
    satirlar[0].search(/[SCM]/) !== -1 ||
    satirlar[yukseklik - 1].search(/[.SCM]/) !== -1 ||
    satirlar.some((s) => s[0] !== '#' || s[genislik - 1] !== '#');
  if (acikKenar) {
    throw new Error('Haritanın dört kenarı da `#` ile kapalı olmalı, yoksa Sezer depodan çıkar.');
  }

  return {
    izgara: { genislik, yukseklik },
    paletler,
    cikolatalar,
    mola: molalar[0],
    baslangicKare: baslangiclar[0],
  };
}
