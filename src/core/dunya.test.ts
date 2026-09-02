import { describe, it, expect } from 'vitest';
import { haritaCoz } from './harita';
import {
  dunyaKur,
  baslangicDurumu,
  ilerle,
  sagaDon,
  solaDon,
  kap,
  molaOdasindaMi,
  onumdePalet,
  ustumdeCikolata,
  bolumTamamMi,
} from './dunya';
import { CalismaHatasi } from './hatalar';
import type { Yon } from './types';

const KONUM = { satir: 3, bolme: 'govde' } as const;

const kur = (satirlar: string[], yon: Yon = 'dogu') => {
  const h = haritaCoz(satirlar.join('\n'));
  const dunya = dunyaKur(h);
  return { dunya, durum: baslangicDurumu(h, yon) };
};

describe('hareket', () => {
  it('dogu yonunde bir kare saga gider', () => {
    const { dunya, durum } = kur(['#####', '#S.M#', '#####']);
    expect(ilerle(durum, dunya, KONUM).kare).toEqual({ x: 2, y: 1 });
  });

  it('kuzey yonunde bir kare yukari gider', () => {
    const { dunya, durum } = kur(['####', '#.M#', '#S.#', '####'], 'kuzey');
    expect(ilerle(durum, dunya, KONUM).kare).toEqual({ x: 1, y: 1 });
  });

  it('palete carpinca satir numarali hata verir', () => {
    const { dunya, durum } = kur(['####', '#S#', '#M#', '####'].map((s) => s.padEnd(4, '#')));
    try {
      ilerle(durum, dunya, KONUM);
      expect.unreachable('hata bekleniyordu');
    } catch (h) {
      expect(h).toBeInstanceOf(CalismaHatasi);
      expect((h as CalismaHatasi).kod).toBe('palete-carptin');
      expect((h as CalismaHatasi).satir).toBe(3);
      expect((h as CalismaHatasi).mesaj).toContain('3. satır');
    }
  });

  it('durumu degistirmez, yenisini uretir', () => {
    const { dunya, durum } = kur(['#####', '#S.M#', '#####']);
    ilerle(durum, dunya, KONUM);
    expect(durum.kare).toEqual({ x: 1, y: 1 });
  });
});

describe('donme', () => {
  it('saga donunce yon saat yonunde ilerler', () => {
    const { durum } = kur(['#####', '#S.M#', '#####'], 'kuzey');
    expect(sagaDon(durum).yon).toBe('dogu');
    expect(sagaDon(sagaDon(durum)).yon).toBe('guney');
  });

  it('sola donunce yon saatin tersine ilerler', () => {
    const { durum } = kur(['#####', '#S.M#', '#####'], 'kuzey');
    expect(solaDon(durum).yon).toBe('bati');
  });

  it('donmek Sezeri hareket ettirmez', () => {
    const { durum } = kur(['#####', '#S.M#', '#####']);
    expect(sagaDon(durum).kare).toEqual(durum.kare);
  });
});

describe('cikolata', () => {
  it('ustundeki cikolatayi alir ve cantaya koyar', () => {
    const { dunya, durum } = kur(['#####', '#SCM#', '#####']);
    const sonra = kap(ilerle(durum, dunya, KONUM), dunya, KONUM);
    expect(sonra.cantada).toBe(1);
    expect(sonra.kalanCikolatalar).toHaveLength(0);
  });

  it('bos karede kap cagrilirsa uyarir', () => {
    const { dunya, durum } = kur(['#####', '#S.M#', '#####']);
    expect(() => kap(durum, dunya, KONUM)).toThrow(/çikolata yok/);
  });
});

describe('sorgular', () => {
  it('mola odasinda olup olmadigini bilir', () => {
    const { dunya, durum } = kur(['####', '#SM#', '####']);
    expect(molaOdasindaMi(durum, dunya)).toBe(false);
    expect(molaOdasindaMi(ilerle(durum, dunya, KONUM), dunya)).toBe(true);
  });

  it('onunde palet olup olmadigini bilir', () => {
    const { dunya, durum } = kur(['#####', '#S.M#', '#####']);
    expect(onumdePalet(durum, dunya)).toBe(false);
    expect(onumdePalet(solaDon(durum), dunya)).toBe(true);
  });

  it('bastigi karede cikolata olup olmadigini bilir', () => {
    const { dunya, durum } = kur(['#####', '#SCM#', '#####']);
    expect(ustumdeCikolata(durum)).toBe(false);
    expect(ustumdeCikolata(ilerle(durum, dunya, KONUM))).toBe(true);
  });
});

describe('bolumTamamMi', () => {
  it('molaya varilmadan tamamlanmis saymaz', () => {
    const { dunya, durum } = kur(['####', '#SM#', '####']);
    expect(bolumTamamMi(durum, dunya)).toBe(false);
  });

  it('molaya varilinca ve cikolata kalmayinca tamamlanir', () => {
    const { dunya, durum } = kur(['####', '#SM#', '####']);
    expect(bolumTamamMi(ilerle(durum, dunya, KONUM), dunya)).toBe(true);
  });

  it('cikolata kaldiysa tamamlanmaz', () => {
    const { dunya, durum } = kur(['#####', '#SCM#', '#####']);
    const molada = ilerle(ilerle(durum, dunya, KONUM), dunya, KONUM);
    expect(molaOdasindaMi(molada, dunya)).toBe(true);
    expect(bolumTamamMi(molada, dunya)).toBe(false);
  });
});
