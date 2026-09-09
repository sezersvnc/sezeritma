import { StreamLanguage } from '@codemirror/language';
import { tags } from '@lezer/highlight';

/**
 * Editörün sözdizimi vurgusu.
 *
 * Tam C++ dilbilgisi yerine kendi alt kümemizi tanıyan küçük bir tokenizer.
 * Gerekçe: oyunun kabul ettiği dil zaten on kadar anahtar kelimeden ibaret,
 * buna karşılık hazır C++ dilbilgisi paketin yarım megabaytını götürüyordu.
 * Öğrencinin okul internetiyle açtığı bir sayfa için ödenmesi anlamsız bir
 * bedel. Vurgu, `src/core/lexer.ts` ile aynı kelimeleri tanır.
 */

const ANAHTAR = new Set([
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

const HARF = /[A-Za-z_]/;
const HARF_VEYA_RAKAM = /[A-Za-z0-9_]/;
const RAKAM = /[0-9]/;

export const cppAltKumesi = StreamLanguage.define<{ blokYorumu: boolean }>({
  name: 'sezeritma-cpp',

  startState: () => ({ blokYorumu: false }),

  token(akis, durum) {
    if (durum.blokYorumu) {
      while (!akis.eol()) {
        if (akis.next() === '*' && akis.eat('/')) {
          durum.blokYorumu = false;
          break;
        }
      }
      return 'comment';
    }

    if (akis.eatSpace()) return null;

    // yorumlar
    if (akis.match('//')) {
      akis.skipToEnd();
      return 'comment';
    }
    if (akis.match('/*')) {
      durum.blokYorumu = true;
      return 'comment';
    }

    // önişlemci satırı: #include gibi
    if (akis.sol() && akis.peek() === '#') {
      akis.skipToEnd();
      return 'meta';
    }

    // metin
    if (akis.peek() === '"') {
      akis.next();
      while (!akis.eol() && akis.next() !== '"') {
        /* kapanış tırnağına kadar */
      }
      return 'string';
    }

    const c = akis.peek() ?? '';

    if (RAKAM.test(c)) {
      akis.eatWhile(RAKAM);
      return 'number';
    }

    if (HARF.test(c)) {
      akis.eatWhile(HARF_VEYA_RAKAM);
      const kelime = akis.current();
      if (ANAHTAR.has(kelime)) return 'keyword';
      // Ardından parantez geliyorsa bu bir komut çağrısı ya da tanımı.
      const kalan = akis.string.slice(akis.pos);
      return /^\s*\(/.test(kalan) ? 'cagri' : 'variableName';
    }

    if ('+-*/%<>=!&|'.includes(c)) {
      akis.eatWhile(/[+\-*/%<>=!&|]/);
      return 'operator';
    }

    akis.next();
    return '{}()[];,'.includes(c) ? 'punctuation' : null;
  },

  /* "function" doğrudan bir etiket değil, bir niteleyici. Kendi adımızı verip
     burada gerçek etikete bağlıyoruz. */
  tokenTable: {
    cagri: tags.function(tags.variableName),
  },

  languageData: {
    commentTokens: { line: '//', block: { open: '/*', close: '*/' } },
    closeBrackets: { brackets: ['(', '{'] },
  },
});
