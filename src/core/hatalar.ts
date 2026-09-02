import type { Bolme, HataKodu } from './types';

/**
 * Öğrenciye gösterilecek hata. Mesaj "HATA" demez; ne olduğunu,
 * nerede olduğunu ve ne denenebileceğini söyler.
 */
export class DerlemeHatasi extends Error {
  constructor(
    readonly kod: HataKodu,
    readonly mesaj: string,
    readonly satir: number,
    readonly bolme: Bolme = 'govde',
  ) {
    super(mesaj);
    this.name = 'DerlemeHatasi';
  }
}

export class CalismaHatasi extends Error {
  constructor(
    readonly kod: HataKodu,
    readonly mesaj: string,
    readonly satir: number,
    readonly bolme: Bolme = 'govde',
  ) {
    super(mesaj);
    this.name = 'CalismaHatasi';
  }
}
