import { describe, it, expect } from 'vitest';
import { haritaCoz } from './harita';

const HARITA = ['#####', '#S.C#', '#.#.#', '#..M#', '#####'].join('\n');

describe('haritaCoz', () => {
  it('izgara olculerini okur', () => {
    expect(haritaCoz(HARITA).izgara).toEqual({ genislik: 5, yukseklik: 5 });
  });

  it('Sezerin baslangic karesini bulur', () => {
    expect(haritaCoz(HARITA).baslangicKare).toEqual({ x: 1, y: 1 });
  });

  it('mola odasini bulur', () => {
    expect(haritaCoz(HARITA).mola).toEqual({ x: 3, y: 3 });
  });

  it('cikolatalari bulur', () => {
    expect(haritaCoz(HARITA).cikolatalar).toEqual([{ x: 3, y: 1 }]);
  });

  it('paletleri bulur ve kenarlari sayar', () => {
    const { paletler } = haritaCoz(HARITA);
    expect(paletler).toContainEqual({ x: 0, y: 0 });
    expect(paletler).toContainEqual({ x: 2, y: 2 });
    expect(paletler).not.toContainEqual({ x: 1, y: 1 });
  });

  it('cikolatasiz haritayi kabul eder', () => {
    expect(haritaCoz(['###', '#S#', '#M#', '###'].join('\n')).cikolatalar).toEqual([]);
  });

  it('esit olmayan satir uzunlugunu reddeder', () => {
    expect(() => haritaCoz(['####', '#SM#', '###'].join('\n'))).toThrow(/aynı uzunlukta/);
  });

  it('Sezer yoksa reddeder', () => {
    expect(() => haritaCoz(['####', '#.M#', '####'].join('\n'))).toThrow(/tam olarak bir tane `S`/);
  });

  it('birden fazla mola odasini reddeder', () => {
    expect(() => haritaCoz(['#####', '#SMM#', '#####'].join('\n'))).toThrow(/tam olarak bir tane `M`/);
  });

  it('tanimadigi sembolu reddeder', () => {
    expect(() => haritaCoz(['####', '#SX#', '#M.#', '####'].join('\n'))).toThrow(/X/);
  });

  it('acik kenari reddeder', () => {
    expect(() => haritaCoz(['####', '.SM#', '####'].join('\n'))).toThrow(/kenar/);
  });
});
