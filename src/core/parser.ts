import { sozcuklereAyir, type Token } from './lexer';
import { DerlemeHatasi } from './hatalar';
import type { Blok, Dugum, FonksiyonTanim, Ifade, Program } from './ast';
import type { Bolme } from './types';

/** Öğrencinin yazması muhtemel ama oyunda yeri olmayan C++ parçaları. */
const DESTEKLENMEYEN: Record<string, string> = {
  cout: 'Bu oyunda `cout` yok. Sezer\'i komutlarla yönetiyorsun.',
  cin: 'Bu oyunda `cin` yok. Sezer dışarıdan girdi almıyor.',
  endl: 'Bu oyunda `endl` yok, çünkü ekrana yazı yazmıyoruz.',
  printf: 'Bu oyunda `printf` yok. Sezer\'i komutlarla yönetiyorsun.',
  scanf: 'Bu oyunda `scanf` yok.',
  string: 'Bu oyunda `string` yok. Sadece `int` ve `bool` var.',
  vector: 'Bu oyunda `vector` yok.',
  include: '`#include` satırı zaten yukarıda, senin yazmana gerek yok.',
};

class Ayristirici {
  private i = 0;
  private readonly tokenlar: Token[];
  private readonly bolme: Bolme;

  constructor(tokenlar: Token[], bolme: Bolme) {
    this.tokenlar = tokenlar;
    this.bolme = bolme;
  }

  // ---------------------------------------------------------- token yardımcıları

  private get simdiki(): Token {
    return this.tokenlar[this.i];
  }

  private get onceki(): Token {
    return this.tokenlar[Math.max(0, this.i - 1)];
  }

  private ilerle(): Token {
    return this.tokenlar[this.i++];
  }

  private bakiyor(deger: string): boolean {
    return this.simdiki.deger === deger && this.simdiki.tip !== 'son';
  }

  private yediysen(deger: string): boolean {
    if (this.bakiyor(deger)) {
      this.i++;
      return true;
    }
    return false;
  }

  private hata(kod: DerlemeHatasi['kod'], mesaj: string, satir: number): never {
    throw new DerlemeHatasi(kod, mesaj, satir, this.bolme);
  }

  private bekle(deger: string, mesaj: string, satir = this.simdiki.satir): Token {
    if (!this.bakiyor(deger)) this.hata('sozdizimi', mesaj, satir);
    return this.ilerle();
  }

  /** Deyim sonundaki noktalı virgül. Yeni başlayanın bir numaralı hatası. */
  private noktaliVirgul(): void {
    if (this.yediysen(';')) return;
    this.hata(
      'noktali-virgul-eksik',
      `${this.onceki.satir}. satırın sonunda noktalı virgül eksik.`,
      this.onceki.satir,
    );
  }

  private konum(satir: number) {
    return { satir, bolme: this.bolme };
  }

  // ---------------------------------------------------------- üst seviye

  program(): Program {
    const govde: Dugum[] = [];
    while (this.simdiki.tip !== 'son') govde.push(this.deyim());
    return {
      fonksiyonlar: [],
      main: { tip: 'blok', govde, ...this.konum(1) },
    };
  }

  fonksiyonlarBolmesi(): FonksiyonTanim[] {
    const liste: FonksiyonTanim[] = [];
    while (this.simdiki.tip !== 'son') {
      const satir = this.simdiki.satir;
      this.bekle(
        'void',
        `${satir}. satırda fonksiyon tanımı bekliyordum. Fonksiyonlar \`void isim() { }\` şeklinde yazılır.`,
      );
      const ad = this.ilerle();
      if (ad.tip !== 'ad') {
        this.hata('sozdizimi', `${satir}. satırda fonksiyona bir isim vermelisin.`, satir);
      }
      this.bekle('(', `${satir}. satırda fonksiyon isminden sonra parantez açmalısın.`);
      this.bekle(')', `${satir}. satırda parantezi kapatmalısın.`);
      liste.push({ ad: ad.deger, govde: this.blok(), ...this.konum(satir) });
    }
    return liste;
  }

  // ---------------------------------------------------------- deyimler

  private blok(): Blok {
    const acilis = this.bekle(
      '{',
      `${this.simdiki.satir}. satırda süslü parantez açmalısın.`,
    );
    const govde: Dugum[] = [];
    while (!this.bakiyor('}')) {
      if (this.simdiki.tip === 'son') {
        this.hata(
          'parantez-kapanmadi',
          `${acilis.satir}. satırda açtığın süslü parantezi kapatmamışsın.`,
          acilis.satir,
        );
      }
      govde.push(this.deyim());
    }
    this.ilerle();
    return { tip: 'blok', govde, ...this.konum(acilis.satir) };
  }

  private deyim(): Dugum {
    const t = this.simdiki;

    if (t.deger === '{') return this.blok();
    if (t.deger === 'for') return this.forDongusu();
    if (t.deger === 'while') return this.whileDongusu();
    if (t.deger === 'if') return this.egerDeyimi();
    if (t.deger === 'return') {
      this.ilerle();
      while (!this.bakiyor(';') && this.simdiki.tip !== 'son') this.ilerle();
      this.noktaliVirgul();
      return { tip: 'return', ...this.konum(t.satir) };
    }
    if (t.deger === 'int' || t.deger === 'bool') {
      const d = this.tanim();
      this.noktaliVirgul();
      return d;
    }
    if (t.deger === 'else') {
      this.hata(
        'sozdizimi',
        `${t.satir}. satırdaki \`else\` bir \`if\` bloğunun hemen ardından gelmeli.`,
        t.satir,
      );
    }

    const d = this.basitDeyim();
    this.noktaliVirgul();
    return d;
  }

  /** `int i = 0` — noktalı virgülü yemez, for başlığında da kullanılıyor. */
  private tanim(): Dugum {
    const anahtar = this.ilerle();
    const ad = this.ilerle();
    if (ad.tip !== 'ad') {
      this.hata(
        'sozdizimi',
        `${anahtar.satir}. satırda \`${anahtar.deger}\` kelimesinden sonra bir değişken adı bekliyordum.`,
        anahtar.satir,
      );
    }
    this.bekle(
      '=',
      `${anahtar.satir}. satırda \`${ad.deger}\` değişkenine bir başlangıç değeri vermelisin: \`${anahtar.deger} ${ad.deger} = 0;\``,
      anahtar.satir,
    );
    return { tip: 'tanim', ad: ad.deger, deger: this.ifade(), ...this.konum(anahtar.satir) };
  }

  /** Komut çağrısı, atama, artırma. Noktalı virgülü yemez. */
  private basitDeyim(): Dugum {
    const ad = this.ilerle();

    if (ad.tip === 'anahtar' && (ad.deger === 'int' || ad.deger === 'bool')) {
      this.i--;
      return this.tanim();
    }
    if (ad.tip !== 'ad') {
      this.hata(
        'sozdizimi',
        `${ad.satir}. satırda \`${ad.deger || 'kodun sonu'}\` ile başlayan bir satırı anlamadım.`,
        ad.satir,
      );
    }

    const acikla = DESTEKLENMEYEN[ad.deger];
    if (acikla) this.hata('desteklenmeyen', acikla, ad.satir);

    if (this.yediysen('(')) {
      this.bekle(')', `${ad.satir}. satırda açtığın parantezi kapatmalısın.`, ad.satir);
      return { tip: 'cagri', ad: ad.deger, ...this.konum(ad.satir) };
    }

    const konum = this.konum(ad.satir);
    const degisken: Ifade = { tip: 'degisken', ad: ad.deger, ...konum };

    if (this.yediysen('=')) {
      return { tip: 'atama', ad: ad.deger, deger: this.ifade(), ...konum };
    }
    if (this.yediysen('++')) {
      return {
        tip: 'atama',
        ad: ad.deger,
        deger: { tip: 'ikili', op: '+', sol: degisken, sag: { tip: 'sayi', deger: 1, ...konum }, ...konum },
        ...konum,
      };
    }
    if (this.yediysen('--')) {
      return {
        tip: 'atama',
        ad: ad.deger,
        deger: { tip: 'ikili', op: '-', sol: degisken, sag: { tip: 'sayi', deger: 1, ...konum }, ...konum },
        ...konum,
      };
    }
    if (this.bakiyor('+=') || this.bakiyor('-=')) {
      const op = this.ilerle().deger[0];
      return {
        tip: 'atama',
        ad: ad.deger,
        deger: { tip: 'ikili', op, sol: degisken, sag: this.ifade(), ...konum },
        ...konum,
      };
    }

    this.hata(
      'sozdizimi',
      `\`${ad.deger}\` komutunu çağırmak için sonuna parantez koymalısın: \`${ad.deger}();\``,
      ad.satir,
    );
  }

  private forDongusu(): Dugum {
    const bas = this.ilerle();
    this.bekle('(', `${bas.satir}. satırda \`for\` kelimesinden sonra parantez açmalısın.`, bas.satir);
    const baslangic = this.bakiyor('int') || this.bakiyor('bool') ? this.tanim() : this.basitDeyim();
    this.bekle(
      ';',
      `${bas.satir}. satırda \`for\` parantezinin içindeki ilk bölümden sonra noktalı virgül olmalı.`,
      bas.satir,
    );
    const kosul = this.ifade();
    this.bekle(
      ';',
      `${bas.satir}. satırda \`for\` koşulundan sonra noktalı virgül olmalı.`,
      bas.satir,
    );
    const artis = this.basitDeyim();
    this.bekle(')', `${bas.satir}. satırda \`for\` parantezini kapatmalısın.`, bas.satir);
    return { tip: 'for', baslangic, kosul, artis, govde: this.blok(), ...this.konum(bas.satir) };
  }

  private whileDongusu(): Dugum {
    const bas = this.ilerle();
    this.bekle('(', `${bas.satir}. satırda \`while\` kelimesinden sonra parantez açmalısın.`, bas.satir);
    const kosul = this.ifade();
    this.bekle(')', `${bas.satir}. satırda \`while\` parantezini kapatmalısın.`, bas.satir);
    return { tip: 'while', kosul, govde: this.blok(), ...this.konum(bas.satir) };
  }

  private egerDeyimi(): Dugum {
    const bas = this.ilerle();
    this.bekle('(', `${bas.satir}. satırda \`if\` kelimesinden sonra parantez açmalısın.`, bas.satir);
    const kosul = this.ifade();
    this.bekle(')', `${bas.satir}. satırda \`if\` parantezini kapatmalısın.`, bas.satir);
    const govde = this.blok();
    let degilse: Blok | Dugum | undefined;
    if (this.yediysen('else')) {
      degilse = this.bakiyor('if') ? this.egerDeyimi() : this.blok();
    }
    return { tip: 'if', kosul, govde, degilse, ...this.konum(bas.satir) };
  }

  // ---------------------------------------------------------- ifadeler

  private ifade(): Ifade {
    return this.veya();
  }

  private ikiliKatman(altKatman: () => Ifade, operatorler: string[]): Ifade {
    let sol = altKatman.call(this);
    while (operatorler.includes(this.simdiki.deger) && this.simdiki.tip === 'isaret') {
      const op = this.ilerle();
      const sag = altKatman.call(this);
      sol = { tip: 'ikili', op: op.deger, sol, sag, ...this.konum(op.satir) };
    }
    return sol;
  }

  private veya = (): Ifade => this.ikiliKatman(this.ve, ['||']);
  private ve = (): Ifade => this.ikiliKatman(this.esitlik, ['&&']);
  private esitlik = (): Ifade => this.ikiliKatman(this.karsilastirma, ['==', '!=']);
  private karsilastirma = (): Ifade => this.ikiliKatman(this.toplama, ['<', '>', '<=', '>=']);
  private toplama = (): Ifade => this.ikiliKatman(this.carpma, ['+', '-']);
  private carpma = (): Ifade => this.ikiliKatman(this.tekli, ['*', '/', '%']);

  private tekli = (): Ifade => {
    if (this.bakiyor('!') || this.bakiyor('-')) {
      const op = this.ilerle();
      return { tip: 'tekli', op: op.deger, operand: this.tekli(), ...this.konum(op.satir) };
    }
    return this.birincil();
  };

  private birincil(): Ifade {
    const t = this.ilerle();
    const konum = this.konum(t.satir);

    if (t.tip === 'sayi') return { tip: 'sayi', deger: Number(t.deger), ...konum };
    if (t.deger === 'true') return { tip: 'dogruluk', deger: true, ...konum };
    if (t.deger === 'false') return { tip: 'dogruluk', deger: false, ...konum };

    if (t.deger === '(') {
      const ic = this.ifade();
      this.bekle(')', `${t.satir}. satırda açtığın parantezi kapatmalısın.`, t.satir);
      return ic;
    }

    if (t.tip === 'ad') {
      const acikla = DESTEKLENMEYEN[t.deger];
      if (acikla) this.hata('desteklenmeyen', acikla, t.satir);
      if (this.yediysen('(')) {
        this.bekle(')', `${t.satir}. satırda açtığın parantezi kapatmalısın.`, t.satir);
        return { tip: 'sorgu', ad: t.deger, ...konum };
      }
      return { tip: 'degisken', ad: t.deger, ...konum };
    }

    this.hata(
      'sozdizimi',
      `${t.satir}. satırda bir değer bekliyordum ama \`${t.deger || 'kodun sonunu'}\` buldum.`,
      t.satir,
    );
  }
}

export function ayristir(govde: string, fonksiyonlar = ''): Program {
  const fonk = fonksiyonlar.trim()
    ? new Ayristirici(sozcuklereAyir(fonksiyonlar, 'fonksiyon'), 'fonksiyon').fonksiyonlarBolmesi()
    : [];
  const program = new Ayristirici(sozcuklereAyir(govde, 'govde'), 'govde').program();
  return { ...program, fonksiyonlar: fonk };
}
