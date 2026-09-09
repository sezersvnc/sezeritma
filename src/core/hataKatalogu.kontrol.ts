import { describe, it, expect, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { calistir } from './yurutucu';
import { bolumUret, haritaOku } from '../serbest/harita';
import type { Bolum } from './types';

/**
 * `npm run hata-katalogu`
 *
 * Öğrencinin yapabileceği yaygın hataları tek tek yapar ve aldığı mesajı
 * docs/hata-katalogu.md dosyasına yazar. Amaç: bu metinleri arada bir
 * baştan okumak. Öğrencinin en çok göreceği yazılar bunlar.
 */

const KORIDOR = ['######', '#S..M#', '######'];
const CIKOLATALI = ['######', '#SC.M#', '######'];
const PALETLI = ['######', '#S.#M#', '######'];

const bolumYap = (satirlar: string[], ek: Partial<Bolum> = {}): Bolum => ({
  ...bolumUret({ hucreler: haritaOku(satirlar.join('\n')), yon: 'dogu' }, { govde: '', fonksiyonlar: '' }),
  ...ek,
});

interface Kayit {
  baslik: string;
  kod: string;
  mesaj: string;
}

const kayitlar: Kayit[] = [];

const dene = (baslik: string, govde: string, bolum = bolumYap(KORIDOR), fonksiyonlar = '') => {
  const sonuc = calistir({ govde, fonksiyonlar }, bolum);
  kayitlar.push({ baslik, kod: fonksiyonlar ? `${fonksiyonlar}\n---\n${govde}` : govde, mesaj: sonuc.hata?.mesaj ?? '(hata yok)' });
  return sonuc;
};

describe('hata katalogu', () => {
  it('yaygın hataların hepsi bir mesaj üretiyor', () => {
    dene('Noktalı virgül unutuldu', 'ilerle()');
    dene('Parantez unutuldu', 'ilerle;');
    dene('Süslü parantez kapatılmadı', 'for (int i = 0; i < 3; i++) {\n  ilerle();');
    dene('Komut adı yanlış yazıldı', 'iIerle();');
    dene('Büyük harf hatası', 'Ilerle();');
    dene('cout kullanıldı', 'cout << 5;');
    dene('Tanımsız değişken', 'sayac = 1;');
    dene('Depo duvarına çarpma', 'ilerle();\nilerle();\nilerle();\nilerle();');
    dene('Palete çarpma', 'ilerle();\nilerle();', bolumYap(PALETLI));
    dene('Boş karede toplama', 'kap();', bolumYap(KORIDOR));
    dene('Sonsuz döngü', 'while (true) {\n  sagaDon();\n}');
    dene('Molaya varmadan bitti', 'ilerle();');
    dene('Çikolata bırakıldı', 'ilerle();\nilerle();\nilerle();', bolumYap(CIKOLATALI));
    dene('Boş kod', '');
    dene('İzin verilmeyen komut', 'kap();', bolumYap(KORIDOR, { izinliKomutlar: ['ilerle'] }));
    dene('İzin verilmeyen yapı', 'for (int i = 0; i < 3; i++) {\n  ilerle();\n}', bolumYap(KORIDOR, { izinliYapilar: [] }));
    dene('Fonksiyona eksik değer', 'ilerleN();', bolumYap(KORIDOR), 'void ilerleN(int n) {\n  ilerle();\n}');
    dene('Oyun komutuna değer verildi', 'ilerle(3);');
    dene('else tek başına', 'else {\n  ilerle();\n}');
    dene('Sıfıra bölme', 'int a = 1 / 0;');
    dene('Değişkene başlangıç değeri yok', 'int a;');
    dene('Fazladan kapanış parantezi', 'for (int i = 0; i < 3; i++) {\n  ilerle();\n}\n}');
    dene('Fonksiyon void ile başlamıyor', 'koseDon();', bolumYap(KORIDOR), 'koseDon() {\n  ilerle();\n}');

    kayitlar.forEach((k) => {
      expect(k.mesaj, k.baslik).not.toBe('(hata yok)');
      // Mesaj öğrenciye ne yapacağını söylemeli, tek kelimeyle geçiştirmemeli.
      expect(k.mesaj.length, k.baslik).toBeGreaterThan(25);
    });
  });
});

afterAll(() => {
  const metin = [
    '# Hata mesajları kataloğu',
    '',
    '`npm run hata-katalogu` ile üretilir. Öğrencinin en çok göreceği metinler bunlar,',
    'o yüzden arada bir baştan okunmayı hak ediyorlar.',
    '',
    'İyi bir mesajın üç işi vardır: ne olduğunu söyler, nerede olduğunu söyler,',
    'ne denenebileceğini söyler.',
    '',
    ...kayitlar.flatMap((k) => [
      `## ${k.baslik}`,
      '',
      '```cpp',
      k.kod || '(boş)',
      '```',
      '',
      `> ${k.mesaj}`,
      '',
    ]),
  ].join('\n');
  writeFileSync('docs/hata-katalogu.md', metin, 'utf8');
});
