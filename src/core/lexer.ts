import { DerlemeHatasi } from './hatalar';

export type TokenTip = 'sayi' | 'ad' | 'anahtar' | 'isaret' | 'son';

export interface Token {
  tip: TokenTip;
  deger: string;
  satir: number;
  sutun: number;
}

const ANAHTARLAR = new Set([
  'int',
  'bool',
  'void',
  'for',
  'while',
  'if',
  'else',
  'return',
  'true',
  'false',
]);

// Uzun olanlar önce denenir, yoksa "<=" iki ayrı token olur.
const IKILI = ['<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-='];
const TEKLI = '(){};,+-*/%<>!=';

const harfMi = (c: string) => /[A-Za-z_]/.test(c);
const rakamMi = (c: string) => /[0-9]/.test(c);

export function sozcuklereAyir(kaynak: string, bolme: 'govde' | 'fonksiyon' = 'govde'): Token[] {
  const tokenlar: Token[] = [];
  let i = 0;
  let satir = 1;
  let satirBasi = 0;

  const sutun = () => i - satirBasi + 1;

  const ekle = (tip: TokenTip, deger: string, s: number, su: number) =>
    tokenlar.push({ tip, deger, satir: s, sutun: su });

  while (i < kaynak.length) {
    const c = kaynak[i];

    if (c === '\n') {
      i++;
      satir++;
      satirBasi = i;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\r') {
      i++;
      continue;
    }

    if (c === '/' && kaynak[i + 1] === '/') {
      while (i < kaynak.length && kaynak[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && kaynak[i + 1] === '*') {
      i += 2;
      while (i < kaynak.length && !(kaynak[i] === '*' && kaynak[i + 1] === '/')) {
        if (kaynak[i] === '\n') {
          satir++;
          satirBasi = i + 1;
        }
        i++;
      }
      i += 2;
      continue;
    }

    if (rakamMi(c)) {
      const bas = i;
      const su = sutun();
      while (i < kaynak.length && rakamMi(kaynak[i])) i++;
      ekle('sayi', kaynak.slice(bas, i), satir, su);
      continue;
    }

    if (harfMi(c)) {
      const bas = i;
      const su = sutun();
      while (i < kaynak.length && (harfMi(kaynak[i]) || rakamMi(kaynak[i]))) i++;
      const kelime = kaynak.slice(bas, i);
      ekle(ANAHTARLAR.has(kelime) ? 'anahtar' : 'ad', kelime, satir, su);
      continue;
    }

    const iki = kaynak.slice(i, i + 2);
    if (IKILI.includes(iki)) {
      ekle('isaret', iki, satir, sutun());
      i += 2;
      continue;
    }

    if (TEKLI.includes(c)) {
      ekle('isaret', c, satir, sutun());
      i++;
      continue;
    }

    throw new DerlemeHatasi(
      'sozdizimi',
      `${satir}. satırda tanımadığım bir işaret var: "${c}". Yazım hatası olabilir mi?`,
      satir,
      bolme,
    );
  }

  ekle('son', '', satir, sutun());
  return tokenlar;
}
