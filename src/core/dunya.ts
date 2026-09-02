import { CalismaHatasi } from './hatalar';
import type { CozulmusHarita } from './harita';
import type { Konum } from './ast';
import type { Durum, Kare, Yon } from './types';

/** Bölümün değişmeyen tarafı: zemin, paletler, mola odası. */
export interface Dunya {
  izgara: { genislik: number; yukseklik: number };
  paletler: ReadonlySet<string>;
  mola: Kare;
}

const anahtar = (k: Kare) => `${k.x},${k.y}`;

const SAAT_YONU: readonly Yon[] = ['kuzey', 'dogu', 'guney', 'bati'];

const ADIM: Record<Yon, Kare> = {
  kuzey: { x: 0, y: -1 },
  dogu: { x: 1, y: 0 },
  guney: { x: 0, y: 1 },
  bati: { x: -1, y: 0 },
};

const YON_ADI: Record<Yon, string> = {
  kuzey: 'yukarı',
  dogu: 'sağa',
  guney: 'aşağı',
  bati: 'sola',
};

export function dunyaKur(harita: CozulmusHarita): Dunya {
  return {
    izgara: harita.izgara,
    paletler: new Set(harita.paletler.map(anahtar)),
    mola: harita.mola,
  };
}

export function baslangicDurumu(harita: CozulmusHarita, yon: Yon): Durum {
  return {
    kare: harita.baslangicKare,
    yon,
    kalanCikolatalar: harita.cikolatalar,
    cantada: 0,
  };
}

const onundekiKare = (durum: Durum): Kare => ({
  x: durum.kare.x + ADIM[durum.yon].x,
  y: durum.kare.y + ADIM[durum.yon].y,
});

const izgaraDisinda = (k: Kare, dunya: Dunya) =>
  k.x < 0 || k.y < 0 || k.x >= dunya.izgara.genislik || k.y >= dunya.izgara.yukseklik;

export function ilerle(durum: Durum, dunya: Dunya, konum: Konum): Durum {
  const hedef = onundekiKare(durum);

  if (izgaraDisinda(hedef, dunya)) {
    throw new CalismaHatasi(
      'disari-ciktin',
      `${konum.satir}. satırda depodan çıktın. Sezer duvarların dışına gidemez.`,
      konum.satir,
      konum.bolme,
    );
  }
  if (dunya.paletler.has(anahtar(hedef))) {
    throw new CalismaHatasi(
      'palete-carptin',
      `${konum.satir}. satırda palete çarptın. ${YON_ADI[durum.yon]} bakıyordun ve orada bir palet vardı. \`onumdePaletVar()\` ile önce kontrol etmeyi deneyebilirsin.`,
      konum.satir,
      konum.bolme,
    );
  }

  return { ...durum, kare: hedef };
}

const dondur = (durum: Durum, adim: number): Durum => {
  const i = SAAT_YONU.indexOf(durum.yon);
  return { ...durum, yon: SAAT_YONU[(i + adim + 4) % 4] };
};

export const sagaDon = (durum: Durum): Durum => dondur(durum, 1);
export const solaDon = (durum: Durum): Durum => dondur(durum, -1);

export function kap(durum: Durum, _dunya: Dunya, konum: Konum): Durum {
  if (!ustumdeCikolata(durum)) {
    throw new CalismaHatasi(
      'bos-kare-kap',
      `${konum.satir}. satırda \`kap();\` çağırdın ama bastığın karede çikolata yok. \`ustumdeCikolataVar()\` ile önce bakabilirsin.`,
      konum.satir,
      konum.bolme,
    );
  }
  return {
    ...durum,
    cantada: durum.cantada + 1,
    kalanCikolatalar: durum.kalanCikolatalar.filter((c) => anahtar(c) !== anahtar(durum.kare)),
  };
}

export const molaOdasindaMi = (durum: Durum, dunya: Dunya): boolean =>
  anahtar(durum.kare) === anahtar(dunya.mola);

export const onumdePalet = (durum: Durum, dunya: Dunya): boolean => {
  const hedef = onundekiKare(durum);
  return izgaraDisinda(hedef, dunya) || dunya.paletler.has(anahtar(hedef));
};

export const ustumdeCikolata = (durum: Durum): boolean =>
  durum.kalanCikolatalar.some((c) => anahtar(c) === anahtar(durum.kare));

export const bolumTamamMi = (durum: Durum, dunya: Dunya): boolean =>
  molaOdasindaMi(durum, dunya) && durum.kalanCikolatalar.length === 0;
