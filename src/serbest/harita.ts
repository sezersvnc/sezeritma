import { haritaCoz } from '../core/harita';
import { satirSay } from '../core/yurutucu';
import { KOMUTLAR, YAPILAR, type Bolum, type Kod, type Yon } from '../core/types';

/**
 * Serbest mod haritası.
 *
 * Oyunun bölümleri elle yazılmış metin dosyaları; burada ise harita
 * çizilerek kuruluyor. Bu dosya çizimi oyunun anladığı `Bolum` nesnesine
 * çeviriyor, dolayısıyla serbest modda da aynı motor, aynı animasyon ve
 * aynı hata mesajları çalışıyor.
 */

export type Hucre = '#' | '.' | 'S' | 'C' | 'M';

export interface Tasarim {
  hucreler: Hucre[][];
  yon: Yon;
}

export const EN_KUCUK = 5;
export const EN_BUYUK = 15;

const kenardaMi = (hucreler: Hucre[][], x: number, y: number) =>
  y === 0 || x === 0 || y === hucreler.length - 1 || x === hucreler[0].length - 1;

export function bosIzgara(genislik: number, yukseklik: number): Hucre[][] {
  return Array.from({ length: yukseklik }, (_, y) =>
    Array.from({ length: genislik }, (_, x): Hucre =>
      y === 0 || x === 0 || y === yukseklik - 1 || x === genislik - 1 ? '#' : '.',
    ),
  );
}

/** Ölçü değişince çizilenler korunur, kenarlar yeniden kapatılır. */
export function yenidenBoyutlandir(
  hucreler: Hucre[][],
  genislik: number,
  yukseklik: number,
): Hucre[][] {
  const yeni = bosIzgara(genislik, yukseklik);
  for (let y = 1; y < yukseklik - 1; y++) {
    for (let x = 1; x < genislik - 1; x++) {
      const eski = hucreler[y]?.[x];
      if (eski && eski !== '#') yeni[y][x] = eski;
    }
  }
  return yeni;
}

/** `S` ve `M` haritada tek olmalı; yenisi konunca eskisi zemine döner. */
export function hucreBoya(hucreler: Hucre[][], x: number, y: number, firca: Hucre): Hucre[][] {
  const yeni = hucreler.map((satir) => [...satir]);
  if (kenardaMi(yeni, x, y)) return yeni;

  if (firca === 'S' || firca === 'M') {
    yeni.forEach((satir, sy) =>
      satir.forEach((h, sx) => {
        if (h === firca) yeni[sy][sx] = '.';
      }),
    );
  }
  yeni[y][x] = firca;
  return yeni;
}

export const haritaMetni = (hucreler: Hucre[][]): string =>
  hucreler.map((satir) => satir.join('')).join('\n');

export const haritaOku = (metin: string): Hucre[][] =>
  metin.split('\n').map((satir) => [...satir] as Hucre[]);

/** Serbest modda her komut ve her yapı açıktır: burası deneme alanı. */
export function bolumUret(tasarim: Tasarim, kod: Kod): Bolum {
  const h = haritaCoz(haritaMetni(tasarim.hucreler));
  return {
    no: 0,
    vardiya: 1,
    ad: 'Serbest harita',
    kavram: 'kendi kurduğun problem',
    gorev: 'Kendi haritan.',
    ipuclari: ['', ''],
    vardiyaNotu: '',
    izgara: h.izgara,
    paletler: h.paletler,
    cikolatalar: h.cikolatalar,
    mola: h.mola,
    baslangic: { kare: h.baslangicKare, yon: tasarim.yon },
    izinliKomutlar: [...KOMUTLAR],
    izinliYapilar: [...YAPILAR],
    hedefSatir: Math.max(1, satirSay(kod)),
    fonksiyonBolmesi: true,
    kartModu: false,
    baslangicKodu: '',
    referansCozum: '',
  };
}

// ------------------------------------------------------------------ paylaşım

interface Paket {
  h: string;
  y: Yon;
  k: string;
  f: string;
}

const metniKodla = (metin: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(metin)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const metniCoz = (kod: string) => {
  const b64 = kod.replace(/-/g, '+').replace(/_/g, '/');
  const ham = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(ham, (c) => c.charCodeAt(0)));
};

/** Harita ve kod tek bir bağlantıya sığar; kimseye hesap gerekmez. */
export const paylasimKodu = (tasarim: Tasarim, kod: Kod): string =>
  metniKodla(
    JSON.stringify({
      h: haritaMetni(tasarim.hucreler),
      y: tasarim.yon,
      k: kod.govde,
      f: kod.fonksiyonlar,
    } satisfies Paket),
  );

export function paylasimiCoz(kodlanmis: string): { tasarim: Tasarim; kod: Kod } | null {
  try {
    const p = JSON.parse(metniCoz(kodlanmis)) as Paket;
    const hucreler = haritaOku(p.h);
    haritaCoz(p.h); // geçersiz haritayı burada eleriz
    return {
      tasarim: { hucreler, yon: p.y },
      kod: { govde: p.k ?? '', fonksiyonlar: p.f ?? '' },
    };
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ rastgele labirent

/**
 * Geri izlemeli labirent üreticisi. Tek hücrelik koridorlar üretir,
 * yani her zaman çözülebilir bir labirent çıkar.
 */
export function rastgeleLabirent(
  genislik: number,
  yukseklik: number,
  rastgele: () => number = Math.random,
): Hucre[][] {
  const g = genislik % 2 === 0 ? genislik - 1 : genislik;
  const y0 = yukseklik % 2 === 0 ? yukseklik - 1 : yukseklik;

  const izgara: Hucre[][] = Array.from({ length: y0 }, () =>
    Array.from({ length: g }, (): Hucre => '#'),
  );

  const yigin: [number, number][] = [[1, 1]];
  izgara[1][1] = '.';
  let uzak: [number, number] = [1, 1];
  let enUzakDerinlik = 0;

  while (yigin.length > 0) {
    const [x, y] = yigin[yigin.length - 1];
    if (yigin.length > enUzakDerinlik) {
      enUzakDerinlik = yigin.length;
      uzak = [x, y];
    }

    const komsular: [number, number][] = [
      [x + 2, y],
      [x - 2, y],
      [x, y + 2],
      [x, y - 2],
    ].filter(
      ([nx, ny]) => nx > 0 && ny > 0 && nx < g - 1 && ny < y0 - 1 && izgara[ny][nx] === '#',
    ) as [number, number][];

    if (komsular.length === 0) {
      yigin.pop();
      continue;
    }

    const [nx, ny] = komsular[Math.floor(rastgele() * komsular.length)];
    izgara[(y + ny) / 2][(x + nx) / 2] = '.';
    izgara[ny][nx] = '.';
    yigin.push([nx, ny]);
  }

  izgara[1][1] = 'S';
  izgara[uzak[1]][uzak[0]] = 'M';
  return izgara;
}
