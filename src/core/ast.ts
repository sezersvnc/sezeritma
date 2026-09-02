import type { Bolme } from './types';

export interface Konum {
  satir: number;
  bolme: Bolme;
}

// ------------------------------------------------------------------ ifadeler

export type Ifade =
  | ({ tip: 'sayi'; deger: number } & Konum)
  | ({ tip: 'dogruluk'; deger: boolean } & Konum)
  | ({ tip: 'degisken'; ad: string } & Konum)
  | ({ tip: 'sorgu'; ad: string } & Konum)
  | ({ tip: 'tekli'; op: string; operand: Ifade } & Konum)
  | ({ tip: 'ikili'; op: string; sol: Ifade; sag: Ifade } & Konum);

// ------------------------------------------------------------------ deyimler

export interface Blok extends Konum {
  tip: 'blok';
  govde: Dugum[];
}

export type Dugum =
  | ({ tip: 'cagri'; ad: string } & Konum)
  | ({ tip: 'tanim'; ad: string; deger: Ifade } & Konum)
  | ({ tip: 'atama'; ad: string; deger: Ifade } & Konum)
  | ({ tip: 'for'; baslangic: Dugum; kosul: Ifade; artis: Dugum; govde: Blok } & Konum)
  | ({ tip: 'while'; kosul: Ifade; govde: Blok } & Konum)
  | ({ tip: 'if'; kosul: Ifade; govde: Blok; degilse?: Blok | Dugum } & Konum)
  | ({ tip: 'return' } & Konum)
  | Blok;

export interface FonksiyonTanim extends Konum {
  ad: string;
  govde: Blok;
}

export interface Program {
  fonksiyonlar: FonksiyonTanim[];
  main: Blok;
}
