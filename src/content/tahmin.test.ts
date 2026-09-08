import { describe, it, expect } from 'vitest';
import { TAHMIN_SECENEKLERI, sonucTuru, tahminGeriBildirimi } from './tahmin';
import { calistir } from '../core/yurutucu';
import { bolumUret, haritaOku } from '../serbest/harita';

const bolumYap = (satirlar: string[]) =>
  bolumUret({ hucreler: haritaOku(satirlar.join('\n')), yon: 'dogu' }, { govde: '', fonksiyonlar: '' });

const KORIDOR = ['######', '#S..M#', '######'];
const kosa = (govde: string, satirlar = KORIDOR) =>
  calistir({ govde, fonksiyonlar: '' }, bolumYap(satirlar));

describe('sonucTuru', () => {
  it('bölümü geçen kodu "gecer" sayar', () => {
    expect(sonucTuru(kosa('ilerle();\nilerle();\nilerle();'))).toBe('gecer');
  });

  it('molaya varmayan kodu "gecemez" sayar', () => {
    expect(sonucTuru(kosa('ilerle();'))).toBe('gecemez');
  });

  it('çikolata bırakan kodu "gecemez" sayar', () => {
    expect(sonucTuru(kosa('ilerle();\nilerle();\nilerle();', ['######', '#SC.M#', '######']))).toBe(
      'gecemez',
    );
  });

  it('palete çarpan kodu "hata" sayar', () => {
    expect(sonucTuru(kosa('ilerle();\nilerle();\nilerle();\nilerle();'))).toBe('hata');
  });

  it('yazım hatasını "hata" sayar', () => {
    expect(sonucTuru(kosa('ilerle()'))).toBe('hata');
  });

  it('sonsuz döngüyü "bitmez" sayar', () => {
    expect(sonucTuru(kosa('while (true) {\n  sagaDon();\n}'))).toBe('bitmez');
  });
});

describe('seçenekler', () => {
  it('dört seçenek var ve hepsi farklı', () => {
    expect(new Set(TAHMIN_SECENEKLERI.map((s) => s.tur)).size).toBe(4);
  });

  it('her sonuç türü bir seçenekle karşılanıyor', () => {
    const turler = new Set(TAHMIN_SECENEKLERI.map((s) => s.tur));
    (['gecer', 'gecemez', 'hata', 'bitmez'] as const).forEach((t) =>
      expect(turler.has(t)).toBe(true),
    );
  });
});

describe('geri bildirim', () => {
  it('tutan tahmini onaylar', () => {
    expect(tahminGeriBildirimi('gecer', 'gecer')).toContain('tuttu');
  });

  it('tutmayan tahminde iki sonucu da söyler', () => {
    const metin = tahminGeriBildirimi('gecer', 'hata');
    expect(metin).toContain('Bölümü geçer');
    expect(metin).toContain('Hata verir');
  });
});
