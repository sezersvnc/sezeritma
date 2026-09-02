import type { Bolme, HataKodu } from './types';

/**
 * Öğrenciye gösterilecek hata. Mesaj "HATA" demez; ne olduğunu,
 * nerede olduğunu ve ne denenebileceğini söyler.
 */
export class DerlemeHatasi extends Error {
  readonly kod: HataKodu;
  readonly mesaj: string;
  readonly satir: number;
  readonly bolme: Bolme;

  constructor(kod: HataKodu, mesaj: string, satir: number, bolme: Bolme = 'govde') {
    super(mesaj);
    this.name = 'DerlemeHatasi';
    this.kod = kod;
    this.mesaj = mesaj;
    this.satir = satir;
    this.bolme = bolme;
  }
}

export class CalismaHatasi extends Error {
  readonly kod: HataKodu;
  readonly mesaj: string;
  readonly satir: number;
  readonly bolme: Bolme;

  constructor(kod: HataKodu, mesaj: string, satir: number, bolme: Bolme = 'govde') {
    super(mesaj);
    this.name = 'CalismaHatasi';
    this.kod = kod;
    this.mesaj = mesaj;
    this.satir = satir;
    this.bolme = bolme;
  }
}
