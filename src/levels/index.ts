import { bolumOku } from './bolumOku';
import type { Bolum } from '../core/types';

const dosyalar = import.meta.glob('./bolumler/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Bölümler dosya adına göre sıralanır: 01.md, 02.md, ... */
export const BOLUMLER: readonly Bolum[] = Object.entries(dosyalar)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([yol, metin]) => {
    const eslesme = /(\d+)\.md$/.exec(yol);
    if (!eslesme) throw new Error(`Bölüm dosyasının adı sayı olmalı: ${yol}`);
    return bolumOku(metin, Number(eslesme[1]));
  });

export const bolumBul = (no: number): Bolum | undefined =>
  BOLUMLER.find((b) => b.no === no);

export const TOPLAM_BOLUM = BOLUMLER.length;
export const EN_FAZLA_YILDIZ = TOPLAM_BOLUM * 3;
