import type { Yon } from '../core/types';

/**
 * Dersler.
 *
 * Oyunun asıl öğretme yükü burada. Üç kural:
 * 1. Kısa cümle. Bir cümlede tek fikir.
 * 2. Önce sorun, sonra çözüm. Kavram, ihtiyaç hissedilmeden anlatılmaz.
 * 3. Her derste çalışan bir örnek. Öğrenci okumakla kalmaz, izler.
 *
 * Ders hiçbir zaman bölümün cevabını vermez.
 */

export interface OrnekSatir {
  kod: string;
  not?: string;
}

/** Ders kartında oynatılan küçük gösteri. Gerçek motorda çalışır. */
export interface Demo {
  harita: readonly string[];
  yon: Yon;
  kod: string;
  /** Gösteride neye dikkat edileceğini tek cümleyle söyler. */
  anlat: string;
}

export interface Ders {
  bolum: number;
  baslik: string;
  /** Hangi sorunu çözüyor. En fazla iki kısa cümle. */
  neden: string;
  /** Nasıl çalışıyor. Kısa maddeler. */
  nasil: readonly string[];
  ornek: readonly OrnekSatir[];
  demo?: Demo;
  /** Tek cümlelik kalıcı özet. */
  hatirla: string;
}

export interface Vardiya {
  no: 1 | 2 | 3 | 4 | 5 | 6;
  ad: string;
  giris: string;
  ozet: string;
}

export const VARDIYALAR: readonly Vardiya[] = [
  {
    no: 1,
    ad: 'Üretim Hattı',
    giris:
      'Bilgisayar hiçbir şeyi kendiliğinden bilmez. Ne yapacağını ona tek tek söylersin. Bu vardiyada Sezer\'i elle yönetmeyi öğreneceksin.',
    ozet:
      'Artık bilgisayara komut verebiliyorsun. Komutlar yukarıdan aşağıya, yazdığın sırayla çalışır. Sıradaki vardiyada aynı komutu tekrar tekrar yazmanın ne kadar can sıkıcı olduğunu göreceksin.',
  },
  {
    no: 2,
    ad: 'İstif Deposu',
    giris:
      'Programcılar aynı şeyi iki kere yazmayı sevmez. Bu vardiya sana nedenini gösterecek ve döngüyü öğretecek.',
    ozet:
      'Döngüyü öğrendin. Tekrarı artık sen değil bilgisayar yapıyor. `for`, kaç kere döneceğini bildiğinde işine yarar. Ama her zaman bilemezsin. Sıradaki vardiya tam olarak bununla ilgili.',
  },
  {
    no: 3,
    ad: 'Sevkiyat Bölgesi',
    giris:
      'Şimdiye kadar her şeyi önceden biliyordun. Gerçek problemlerde bilemezsin. Bu vardiyada programın kendi kararını vermeyi öğrenecek.',
    ozet:
      'Programın artık karar verebiliyor. `while` bilinmeyen sayıda tekrar yapar, `if` ve `else` duruma göre yol ayırır. Bu ikisi birleşince ortaya algoritma çıkar. Algoritma ezberlenmiş bir yol değildir, her labirenti çözen bir kuraldır.',
  },
  {
    no: 4,
    ad: 'Gece Vardiyası',
    giris:
      'Programın bu vardiyada bir şey hatırlayabilecek. Kendi komutlarını da yazabilecek. Gerçek programcılığa en yakın olduğun yer burası.',
    ozet:
      'Değişkenle bilgi saklamayı, koşulları birleştirmeyi ve kendi fonksiyonunu yazmayı öğrendin. Dört temel fikir bunlar: sıra, tekrar, karar, isimlendirme. Hangi dili öğrenirsen öğren aynı dördünü göreceksin.',
  },
  {
    no: 5,
    ad: 'Hata Ayıklama',
    giris:
      'Şimdiye kadar hep sen yazdın. Bu vardiyada kodu başkası yazdı ve çalışmıyor. Bir programcının zamanının çoğu burada geçer.',
    ozet:
      'Artık bozuk bir kodu okuyup düzeltebiliyorsun. Bu, kod yazmaktan daha zor bir beceridir. Senin yazdığın kod da bir gün çalışmayacak ve o gün burada öğrendiğin refleksi kullanacaksın.',
  },
  {
    no: 6,
    ad: 'Usta İşi',
    giris:
      'Temel dördünü biliyorsun: sıra, tekrar, karar, isimlendirme. Bu vardiya onların üzerine kuruluyor. Bölümler daha uzun düşünmeni isteyecek.',
    ozet:
      'Bitti. Evet-hayır saklayabiliyor, komutlarını birbirinin içinde kullanabiliyor, ritim kurabiliyor ve bir komuta kendini çağırtabiliyorsun. Gerçek programların çoğu bu fikirlerin birleşiminden ibaret.',
  },
];

/** Ders gösterileri için düz koridor üretir. */
const koridor = (uzunluk: number): string[] => {
  const orta = `#S${'.'.repeat(uzunluk)}M#`;
  const duvar = '#'.repeat(orta.length);
  return [duvar, orta, duvar];
};

export const DERSLER: readonly Ders[] = [
  {
    bolum: 1,
    baslik: 'Algoritma nedir?',
    neden:
      'Kod yazmayı bilmiyor olabilirsin, sorun değil. Programlamanın özü kod değil, algoritmadır. Algoritmayı zaten biliyorsun.',
    nasil: [
      'Birine çay yapmayı tarif ettiğini düşün. Suyu koy, kaynat, demle, bekle.',
      'Sırayı bozarsan çay olmaz. Bir adımı atlarsan yine olmaz.',
      'İşte bu bir algoritma: sırası önemli, eksiksiz adımlar.',
      'Bilgisayar da böyledir. Ne yapacağını tek tek söylemen gerekir.',
      'İlk bölümlerde kod yazmayacaksın. Komut kartlarına basacaksın, satırlar senin yerine yazılacak.',
    ],
    ornek: [
      { kod: 'suyu koy;', not: 'Önce bu.' },
      { kod: 'kaynat;', not: 'Sonra bu.' },
      { kod: 'demle;', not: 'Sıra değişirse çay olmaz.' },
    ],
    demo: {
      harita: ['#####', '#S.M#', '#####'],
      yon: 'dogu',
      kod: 'ilerle();\nilerle();',
      anlat: 'İki komut, iki adım. Sezer yazdığın sırayla hareket ediyor.',
    },
    hatirla: 'Algoritma, bir işi yapan sıralı ve eksiksiz adımlardır.',
  },
  {
    bolum: 2,
    baslik: 'Komut ve sıra',
    neden:
      'Bilgisayar tahmin yürütmez. "Mola odasına git" demek işe yaramaz. Her adımı söylemen gerekir.',
    nasil: [
      'Her komut bir satırdır.',
      'Satırlar yukarıdan aşağıya, yazdığın sırayla çalışır.',
      'Her satırın sonunda noktalı virgül vardır.',
      'Noktalı virgül cümlenin noktası gibidir. "Bu komut bitti" demektir.',
    ],
    ornek: [
      { kod: 'ilerle();', not: 'Bir kare gidersin.' },
      { kod: 'ilerle();', not: 'Bir kare daha. İki satır, iki adım.' },
    ],
    demo: {
      harita: koridor(2),
      yon: 'dogu',
      kod: 'ilerle();\nilerle();\nilerle();',
      anlat: 'Üç satır alt alta. Bilgisayar hiçbirini atlamıyor, sırasını değiştirmiyor.',
    },
    hatirla: 'Komutlar yazdığın sırayla çalışır. Her satırın sonunda noktalı virgül vardır.',
  },
  {
    bolum: 3,
    baslik: 'Yön: nereye baktığın önemli',
    neden:
      '`ilerle();` "sağa git" demek değildir. "Baktığın yöne git" demektir. Aynı komut, farklı yöne bakarken farklı sonuç verir.',
    nasil: [
      '`sagaDon();` Sezer\'i yerinde çevirir.',
      'Bir kare bile ilerlemez. Sadece bakış yönü değişir.',
      'Ondan sonraki `ilerle();` artık yeni yöne gider.',
    ],
    ornek: [
      { kod: 'ilerle();', not: 'Doğuya bakıyor, doğuya gidiyor.' },
      { kod: 'sagaDon();', not: 'Yerinde döndü. Konumu aynı, yönü güney.' },
      { kod: 'ilerle();', not: 'Aynı komut, bu sefer aşağı gidiyor.' },
    ],
    demo: {
      harita: ['#####', '#S.##', '##.##', '##M##', '#####'],
      yon: 'dogu',
      kod: 'ilerle();\nsagaDon();\nilerle();\nilerle();',
      anlat: 'İkinci satırda Sezer kıpırdamıyor, sadece dönüyor. Fark ondan sonra ortaya çıkıyor.',
    },
    hatirla: 'Dönmek ilerlemek değildir. Aynı komut, farklı yönde farklı sonuç verir.',
  },
  {
    bolum: 4,
    baslik: 'Her komutun bir şartı vardır',
    neden:
      '`kap();` çikolatayı alır ama her yerde çalışmaz. Sezer tam çikolatanın üstünde duruyor olmalı.',
    nasil: [
      'Önce çikolatanın olduğu kareye git.',
      'Sonra `kap();` yaz.',
      'Yan karedeyken kapmaya çalışırsan elin boşa gider.',
    ],
    ornek: [
      { kod: 'ilerle();', not: 'Çikolatanın olduğu kareye çıktı.' },
      { kod: 'kap();', not: 'Şart sağlandı, çikolata çantada.' },
      { kod: 'ilerle();', not: 'Yoluna devam.' },
    ],
    demo: {
      harita: ['######', '#SC.M#', '######'],
      yon: 'dogu',
      kod: 'ilerle();\nkap();\nilerle();\nilerle();',
      anlat:
        "İkinci satır ancak birinci satır Sezer'i doğru kareye getirdiği için çalışıyor.",
    },
    hatirla: 'Bir komut, ancak koşulları yerindeyse iş görür. Sırayı bunun için kuruyorsun.',
  },
  {
    bolum: 5,
    baslik: 'Büyük işi parçalara böl',
    neden:
      'Bu bölümün yolu uzun. Tek seferde düşünmeye çalışırsan karışır. Profesyoneller de böyle yapmaz.',
    nasil: [
      'İşi parçalara ayır: önce çikolataya git, sonra mola odasına git.',
      'Her parçayı ayrı ayrı çöz, sonra alt alta ekle.',
      'Bir parça çalışmıyorsa hatanın nerede olduğunu bilirsin.',
      'Bu yöntemin adı var: problemi bölerek çözmek.',
    ],
    ornek: [
      { kod: '// birinci parça', not: 'Çikolataya kadar git ve al.' },
      { kod: '// ikinci parça', not: 'Oradan mola odasına git.' },
      { kod: '// ikisini alt alta koy', not: 'Bütün çözüm bu.' },
    ],
    demo: {
      harita: ['#####', '#S.C#', '#...#', '#M..#', '#####'],
      yon: 'dogu',
      kod: 'ilerle();\nilerle();\nkap();\nsagaDon();\nilerle();\nilerle();\nsagaDon();\nilerle();\nilerle();',
      anlat: 'İlk üç satır bir iş, kalanı başka bir iş. İkisini birleştirince bölüm bitiyor.',
    },
    hatirla: 'Çözemediğin bir iş, çözebileceğin iki parçaya bölünebilir.',
  },
  {
    bolum: 6,
    baslik: 'Tekrar can sıkıcıdır',
    neden:
      'Bu bölümde aynı komutu on iki kere art arda vereceksin. Sıkılacaksın. Bu kasıtlı.',
    nasil: [
      'Yazarken şunu düşün: koridor iki yüz kare olsaydı ne yapardın?',
      'Ya uzunluğunu hiç bilmeseydin?',
      'On iki kere tekrarlamak çözüm değildir. On iki ayrı hata yeri demektir.',
      'Bir sonraki bölüm bunu iki satıra indirecek.',
    ],
    ornek: [
      { kod: 'ilerle();' },
      { kod: 'ilerle();' },
      { kod: '...', not: 'Ve böyle on iki kere.' },
    ],
    demo: {
      harita: koridor(5),
      yon: 'dogu',
      kod: 'ilerle();\nilerle();\nilerle();\nilerle();\nilerle();\nilerle();',
      anlat: 'Altı satır, altı adım. Aynı satırı kopyalamak dışında yaptığın bir şey yok.',
    },
    hatirla: 'Aynı şeyi iki kere yazıyorsan, daha iyi bir yolu vardır.',
  },
  {
    bolum: 7,
    baslik: 'for döngüsü',
    neden:
      'Geçen bölümde on iki satır yazdın. Şimdi aynı işi iki satırda yapacaksın. Tekrarı bilgisayar yapacak.',
    nasil: [
      'Döngü, süslü parantezin içindekileri belirlediğin sayıda tekrarlar.',
      '`for` başlığındaki üç bölüm sırayla şunu söyler:',
      'Sayaç nereden başlasın, ne zamana kadar sürsün, her turda nasıl değişsin.',
      '`i < 12` yazdığında döngü on iki kere döner.',
    ],
    ornek: [
      {
        kod: 'for (int i = 0; i < 12; i++) {',
        not: 'Sıfırdan başla, 12 olana kadar sür, birer birer art.',
      },
      { kod: '  ilerle();', not: 'Bu satır her turda çalışır.' },
      { kod: '}', not: 'Buraya gelince başa döner.' },
    ],
    demo: {
      harita: koridor(5),
      yon: 'dogu',
      kod: 'for (int i = 0; i < 6; i++) {\n  ilerle();\n}',
      anlat: 'İki satır, altı adım. Sağdaki i sayacının nasıl arttığına bak.',
    },
    hatirla: '`for`, kaç kere tekrarlanacağını önceden bildiğin durumlar içindir.',
  },
  {
    bolum: 8,
    baslik: 'Döngünün gövdesi',
    neden: 'Tekrarlanan şey her zaman tek komut değildir. Çoğu zaman bir hareket dizisidir.',
    nasil: [
      'Süslü parantezin arasına istediğin kadar komut koyabilirsin.',
      'Hepsi her turda, yazdığın sırayla çalışır.',
      'Buna döngünün gövdesi denir.',
    ],
    ornek: [
      { kod: 'for (int i = 0; i < 3; i++) {' },
      { kod: '  ilerle();', not: 'Her turda önce bu,' },
      { kod: '  kap();', not: 'sonra bu. Üç turda altı komut.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#########', '#S.C.C.M#', '#########'],
      yon: 'dogu',
      kod: 'for (int i = 0; i < 2; i++) {\n  ilerle();\n  ilerle();\n  kap();\n}\nilerle();\nilerle();',
      anlat: 'Her turda üç komut çalışıyor: iki adım ve bir toplama.',
    },
    hatirla: 'Döngü tek komutu değil, gövdesindeki bütün diziyi tekrarlar.',
  },
  {
    bolum: 9,
    baslik: 'Döngünün içinde dönmek',
    neden:
      'Şimdiye kadar döngü hep aynı yöne gitti. Bazen tekrarlanan şey bir dönüş de içerir.',
    nasil: [
      'Gövdeye `sagaDon();` koyarsan dönüş de her turda tekrarlanır.',
      'Kare çizmek tam olarak budur: kenar, dönüş, kenar, dönüş.',
    ],
    ornek: [
      { kod: 'for (int i = 0; i < 4; i++) {', not: 'Dört kenar, dört tur.' },
      { kod: '  ilerle();' },
      { kod: '  ilerle();', not: 'Kenarın uzunluğu.' },
      { kod: '  sagaDon();', not: 'Köşe. Her turun sonunda bir kere.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#####', '#S..#', '#.M.#', '#...#', '#####'],
      yon: 'dogu',
      kod: 'for (int i = 0; i < 2; i++) {\n  ilerle();\n  sagaDon();\n}',
      anlat: 'İki tur, iki kenar. Dönüş de tekrarlandığı için yön her turda değişiyor.',
    },
    hatirla: 'Döngü sadece hareketi değil, dönüşü de tekrarlar.',
  },
  {
    bolum: 10,
    baslik: 'İç içe döngü',
    neden:
      'Bazen tekrarın kendisi de tekrarlanır. "Her kenarda dört adım at, sonra köşeyi dön" cümlesinde iki tekrar var.',
    nasil: [
      'Bir döngünün gövdesine başka bir döngü koyabilirsin.',
      'Dıştaki her turda, içteki döngü baştan sona çalışır.',
      'Üç dış tur çarpı dört iç tur, toplam on iki kere.',
    ],
    ornek: [
      { kod: 'for (int i = 0; i < 3; i++) {', not: 'Dış döngü: kenarları sayar.' },
      { kod: '  for (int j = 0; j < 4; j++) {', not: 'İç döngü: o kenardaki kareleri sayar.' },
      { kod: '    ilerle();' },
      { kod: '  }' },
      { kod: '  sagaDon();', not: 'İç döngü bitince, her dış turda bir kere.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#####', '#S..#', '#...#', '#..M#', '#####'],
      yon: 'dogu',
      kod: 'for (int i = 0; i < 2; i++) {\n  for (int j = 0; j < 2; j++) {\n    ilerle();\n  }\n  sagaDon();\n}',
      anlat: 'i dışta, j içte. j her seferinde sıfırdan başlıyor.',
    },
    hatirla: 'İç içe döngüde iç kısım, dıştaki her tur için baştan sona çalışır.',
  },
  {
    bolum: 11,
    baslik: 'while döngüsü',
    neden:
      '`for` kaç kere döneceğini bildiğinde işe yarar. Koridorun uzunluğunu bilmiyorsun. Ama ne zaman duracağını biliyorsun.',
    nasil: [
      '`while` bir koşula bakar.',
      'Koşul doğru olduğu sürece gövdesini tekrarlar.',
      'Koşul yanlış olduğu an durur.',
      '`!` işareti "değil" demektir. `!molaOdasindaMiyim()` yani "mola odasında değilken".',
    ],
    ornek: [
      { kod: 'while (!molaOdasindaMiyim()) {', not: 'Her turun başında koşula bakar.' },
      { kod: '  ilerle();', not: 'Koşul doğruysa çalışır, sonra tekrar bakar.' },
      { kod: '}', not: 'Koşul yanlış olunca biter.' },
    ],
    demo: {
      harita: koridor(5),
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim()) {\n  ilerle();\n}',
      anlat: 'Kaç adım olduğunu kod bilmiyor. Sadece ne zaman duracağını biliyor.',
    },
    hatirla:
      '`while` sayıya değil koşula bakar. Koşulu yanlış yapacak bir şey olmazsa program hiç bitmez.',
  },
  {
    bolum: 12,
    baslik: 'Durma koşulunu seçmek',
    neden:
      'Döngünün ne zaman duracağını sen seçersin. Aynı problemde birden fazla doğru cevap olabilir.',
    nasil: [
      '`!molaOdasindaMiyim()` demek "hedefe varana kadar" demektir.',
      '`!onumdePaletVar()` demek "yol kapanana kadar" demektir.',
      'İkisi de geçerlidir. Hangisini seçeceğin probleme bağlıdır.',
      'Hedefin nerede olduğunu bilmiyorsan ikincisi işini görür.',
    ],
    ornek: [
      { kod: 'while (!molaOdasindaMiyim())', not: 'Hedefe varınca dur.' },
      { kod: 'while (!onumdePaletVar())', not: 'Yol kapanınca dur.' },
      { kod: 'while (sayac < 5)', not: 'Beşe ulaşınca dur.' },
    ],
    demo: {
      harita: ['#######', '#S...M#', '#######'],
      yon: 'dogu',
      kod: 'while (!onumdePaletVar()) {\n  ilerle();\n}',
      anlat: 'Bu kod mola odasını hiç sormuyor. Sadece önü kapanınca duruyor.',
    },
    hatirla: 'Döngüyü kurmadan önce sor: bu ne zaman bitmeli?',
  },
  {
    bolum: 13,
    baslik: 'if: karar vermek',
    neden:
      'Şimdiye kadar programın hep aynı şeyi yaptı. Ama önünde palet olup olmaması duruma göre değişir. Programın bakması ve ona göre davranması gerekir.',
    nasil: [
      '`if` parantezin içindeki koşula bakar.',
      'Koşul doğruysa süslü parantezin içini çalıştırır.',
      'Yanlışsa hiç uğramadan geçer.',
      'Bu, programın ilk kez düşünmesidir.',
    ],
    ornek: [
      { kod: 'if (onumdePaletVar()) {', not: 'Sadece palet varsa içeri girer.' },
      { kod: '  sagaDon();', not: 'Palet yoksa bu satır hiç çalışmaz.' },
      { kod: '}' },
      { kod: 'ilerle();', not: 'Bu satır her durumda çalışır.' },
    ],
    demo: {
      harita: ['######', '#S..##', '###.##', '###M##', '######'],
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim()) {\n  if (onumdePaletVar()) {\n    sagaDon();\n  }\n  ilerle();\n}',
      anlat: 'Üçüncü karede palet çıkıyor ve `if` devreye giriyor. Öncekilerde hiç çalışmıyor.',
    },
    hatirla: '`if` koşul doğruysa çalışır, yanlışsa atlanır.',
  },
  {
    bolum: 14,
    baslik: 'if ve else: iki yol',
    neden: 'Bazen "doğruysa şunu yap" yetmez. "Değilse de şunu yap" demen gerekir.',
    nasil: [
      '`else`, `if` bloğunun hemen ardına gelir.',
      'Koşul yanlış olduğunda çalışır.',
      'İkisinden tam olarak biri çalışır. Asla ikisi birden değil.',
    ],
    ornek: [
      { kod: 'if (ustumdeCikolataVar()) {', not: 'Koşul doğruysa...' },
      { kod: '  kap();', not: '...sadece bu çalışır.' },
      { kod: '} else {', not: 'Koşul yanlışsa...' },
      { kod: '  ilerle();', not: '...sadece bu çalışır.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['########', '#S.CC.M#', '########'],
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim()) {\n  if (ustumdeCikolataVar()) {\n    kap();\n  } else {\n    ilerle();\n  }\n}',
      anlat: 'Her turda ya kapıyor ya ilerliyor. İkisini birden asla yapmıyor.',
    },
    hatirla: '`if` ve `else` iki yoldan birini seçer.',
  },
  {
    bolum: 15,
    baslik: 'else if: üçüncü yol',
    neden:
      '`if` ve `else` iki yol açar. Ama durumlar çoğu zaman ikiden fazladır. Çikolata mı var, palet mi var, yoksa yol açık mı?',
    nasil: [
      '`else if` araya girer ve yeni bir soru sorar.',
      'Sırayla denenir. İlk doğru olan çalışır, gerisine bakılmaz.',
      'Bu yüzden sıralama önemlidir.',
    ],
    ornek: [
      { kod: 'if (ustumdeCikolataVar()) {', not: 'Önce buna bakar.' },
      { kod: '  kap();' },
      { kod: '} else if (onumdePaletVar()) {', not: 'Birincisi yanlışsa buna bakar.' },
      { kod: '  sagaDon();' },
      { kod: '} else {', not: 'Hiçbiri değilse burası.' },
      { kod: '  ilerle();' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#######', '#S.C.##', '####.##', '####M##', '#######'],
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim()) {\n  if (ustumdeCikolataVar()) {\n    kap();\n  } else if (onumdePaletVar()) {\n    sagaDon();\n  } else {\n    ilerle();\n  }\n}',
      anlat: 'Üç dal da sırası gelince çalışıyor: önce toplama, sonra dönüş, sonra ilerleme.',
    },
    hatirla: '`else if` zincirinde yalnızca ilk doğru dal çalışır.',
  },
  {
    bolum: 16,
    baslik: 'Duvar takibi: tek kural, her labirent',
    neden:
      'Bu labirentin yolunu ezberleyip komutları tek tek yazabilirdin. Ama o çözüm sadece bu labirentte işe yarar.',
    nasil: [
      'Algoritma, bir problemi çözen adım adım kuraldır.',
      'Buradaki kural tek cümle: önünde palet varsa sağa dön, yoksa ilerle.',
      'Bu kuralı bir döngüye koyduğunda labirentin şeklini bilmen gerekmez.',
      'Bu senin uydurduğun bir numara değil. Adı duvar takibi ve gerçek robotlar kullanıyor.',
    ],
    ornek: [
      { kod: 'while (bitmedi) {', not: 'Tekrar: kuralı sürekli uygula.' },
      { kod: '  if (engel var) don();', not: 'Karar: duruma göre davran.' },
      { kod: '  else ilerle();', not: 'Üç satır, sınırsız labirent.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['######', '#S..##', '###.##', '###M##', '######'],
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim()) {\n  if (onumdePaletVar()) {\n    sagaDon();\n  } else {\n    ilerle();\n  }\n}',
      anlat: 'Bu kod bu haritaya özel değil. Aynı kural başka labirentlerde de çalışır.',
    },
    hatirla: 'Algoritma tek bir problemi değil, bir problem ailesini çözer.',
  },
  {
    bolum: 17,
    baslik: 'Değişken: hatırlamak',
    neden:
      'Şimdiye kadar programın hiçbir şey hatırlamıyordu. Kaç çikolata topladığını soramazdın.',
    nasil: [
      '`int sayac = 0;` bellekte `sayac` adında bir kutu açar ve içine sıfır koyar.',
      '`int` "içine tam sayı girer" demektir.',
      '`sayac++` kutudaki sayıyı bir artırır.',
      'Izgaranın altındaki panelde değerin canlı değiştiğini görürsün.',
    ],
    ornek: [
      { kod: 'int sayac = 0;', not: 'Kutuyu aç. Bir kere, döngüden önce.' },
      { kod: 'while (...) {' },
      { kod: '  kap();' },
      { kod: '  sayac++;', not: 'Her toplamada bir artır.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#######', '#SC.CM#', '#######'],
      yon: 'dogu',
      kod: 'int sayac = 0;\nwhile (!molaOdasindaMiyim()) {\n  if (ustumdeCikolataVar()) {\n    kap();\n    sayac++;\n  } else {\n    ilerle();\n  }\n}',
      anlat: 'Sağdaki sayacın sıfırdan ikiye çıkışını izle.',
    },
    hatirla: 'Değişken programın belleğidir. Döngüden önce tanımlanır, içinde değişir.',
  },
  {
    bolum: 18,
    baslik: 'Değişkenle karar vermek',
    neden:
      'Şimdiye kadar değişken sadece sayıyordu. Asıl gücü, o sayının programın ne yapacağını belirlemesi.',
    nasil: [
      'Sayacı bir koşulun içinde kullanırsın: `if (adim == 3)`.',
      '`==` "eşit mi" diye sorar.',
      'Tek `=` ise atama yapar. İkisi farklı şeydir, karıştırmak klasik bir hatadır.',
      'Etrafta hiç ipucu yokken bile doğru anda dönebilirsin.',
    ],
    ornek: [
      { kod: 'int adim = 0;', not: 'Sayacı kur.' },
      { kod: 'while (...) {' },
      { kod: '  if (adim == 3) sagaDon();', not: 'Sayı karara dönüşüyor.' },
      { kod: '  ilerle();' },
      { kod: '  adim++;', not: 'Her turda bir artır.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#####', '#S..#', '#...#', '#..M#', '#####'],
      yon: 'dogu',
      kod: 'int adim = 0;\nwhile (!molaOdasindaMiyim()) {\n  if (adim == 2) {\n    sagaDon();\n  }\n  ilerle();\n  adim++;\n}',
      anlat: 'Ortalık açık, hiçbir duvar yol göstermiyor. Dönüş kararını sayaç veriyor.',
    },
    hatirla: 'Sensörler dış dünyayı görür, değişkenler geçmişi hatırlar.',
  },
  {
    bolum: 19,
    baslik: 'Koşulları birleştirmek',
    neden:
      'Bazen durman için tek sebep yoktur. Hem hedefe varmak hem yolun kapanması durmanı gerektirebilir.',
    nasil: [
      '`&&` "ve" demektir. İki koşul da doğruysa sonuç doğrudur.',
      'Biri bile yanlışsa döngü durur.',
      '`||` "veya" demektir. Birinin doğru olması yeter.',
      '`!` "değil" demektir. Doğruyu yanlışa çevirir.',
    ],
    ornek: [
      { kod: 'while (sayac < 5 && !molaOdasindaMiyim()) {', not: 'İkisi de doğruyken devam.' },
      { kod: '  ...', not: 'Biri bozulunca döngü biter.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['######', '#S..##', '###.##', '###M##', '######'],
      yon: 'dogu',
      kod: 'while (!molaOdasindaMiyim() && !onumdePaletVar()) {\n  ilerle();\n}\nsagaDon();\nwhile (!molaOdasindaMiyim()) {\n  ilerle();\n}',
      anlat: 'İlk döngü palete rastlayınca duruyor, mola odasına varmadan.',
    },
    hatirla: '`&&` ikisi de, `||` biri yeter, `!` tersi.',
  },
  {
    bolum: 20,
    baslik: 'Fonksiyon: kendi komutun',
    neden:
      'Bir hareket dizisini tekrar tekrar yazıyorsan ona bir isim verebilirsin. O andan sonra o dizi senin için tek bir komuttur.',
    nasil: [
      'Editörde `main()` üstünde ikinci bir bölme açıldı.',
      'Orada `void koseDon() { }` yazıp içine komutları koyarsın.',
      'Sonra `main()` içinde `koseDon();` diye çağırırsın.',
      'Tanımlamak onu çalıştırmaz. Çağırmak çalıştırır.',
    ],
    ornek: [
      { kod: 'void koseDon() {', not: 'Tanım: bu isim ne yapacak?' },
      { kod: '  sagaDon();' },
      { kod: '  ilerle();' },
      { kod: '}', not: 'Tanım bitti. Henüz hiçbir şey çalışmadı.' },
      { kod: '', not: '' },
      { kod: 'koseDon();', not: 'Çağrı: içindeki iki komut şimdi çalışıyor.' },
    ],
    demo: {
      harita: ['#####', '#S.##', '##M##', '#####'],
      yon: 'dogu',
      kod: 'void koseDon() {\n  sagaDon();\n  ilerle();\n}\n--- main ---\nilerle();\nkoseDon();',
      anlat: 'Üstteki tanım kendiliğinden çalışmıyor. Aşağıdaki çağrı onu çalıştırıyor.',
    },
    hatirla: 'Fonksiyon tanımlamak onu çalıştırmaz. Çağırmak çalıştırır.',
  },
  {
    bolum: 21,
    baslik: 'Parametre: komuta bilgi vermek',
    neden:
      'Yazdığın `koseDon()` her seferinde aynı işi yapıyordu. Çoğu zaman "aynı iş, farklı sayıda" gerekir.',
    nasil: [
      'Fonksiyonun parantezine bir parametre koyarsın: `void ilerleN(int n)`.',
      '`n`, çağrılırken verdiğin sayının fonksiyon içindeki adıdır.',
      '`ilerleN(3);` yazdığında fonksiyon `n` yerine üç görür.',
      'Parametre fonksiyonun içinde yaşar. Dışarıdaki değişkenleri etkilemez.',
    ],
    ornek: [
      { kod: 'void ilerleN(int n) {', not: 'n, dışarıdan gelecek sayının adı.' },
      { kod: '  for (int i = 0; i < n; i++) {', not: 'Kaç kere döneceğini n söyler.' },
      { kod: '    ilerle();' },
      { kod: '  }' },
      { kod: '}' },
      { kod: '', not: '' },
      { kod: 'ilerleN(3);', not: 'Bu çağrıda n üçtür.' },
    ],
    demo: {
      harita: koridor(2),
      yon: 'dogu',
      kod: 'void ilerleN(int n) {\n  for (int i = 0; i < n; i++) {\n    ilerle();\n  }\n}\n--- main ---\nilerleN(3);',
      anlat: 'Tek satırlık çağrı üç adıma dönüşüyor. Sayıyı sen veriyorsun.',
    },
    hatirla: 'Parametre, bir komuta iş yaparken kullanacağı bilgiyi vermenin yoludur.',
  },
  {
    bolum: 22,
    baslik: 'Hepsi bir arada',
    neden:
      'Son bölüm yeni bir kavram öğretmiyor. Öğrendiklerini aynı anda kullanman gerekiyor. Gerçek programlar da böyledir.',
    nasil: [
      'Sıra: komutlar yazdığın düzende çalışır.',
      'Tekrar: `for` ve `while` aynı işi defalarca yapar.',
      'Karar: `if` ve `else` duruma göre yol ayırır.',
      'İsimlendirme: değişkenler bilgiye, fonksiyonlar davranışa isim verir.',
      'Hangi dili öğrenirsen öğren aynı dördünü göreceksin.',
    ],
    ornek: [
      { kod: 'while (bitmedi) {', not: 'Tekrar' },
      { kod: '  if (a) ...', not: 'Karar' },
      { kod: '  else if (b) ...', not: 'Karar' },
      { kod: '  else ...', not: 'Sıra' },
      { kod: '}' },
    ],
    hatirla: 'Sıra, tekrar, karar, isimlendirme. Bütün programlar bu dördünden kuruludur.',
  },
  {
    bolum: 23,
    baslik: 'Hata ayıklama',
    neden:
      'Kod yazmak işin kolay yarısı. Çalışmayan bir kodu okuyup neyin yanlış olduğunu bulmak asıl beceridir.',
    nasil: [
      'Bir: çalıştır. Tahmin etme, gör. Kod gerçekte ne yapıyor?',
      'İki: karşılaştır. Ne olmasını istiyordun? Fark nerede başlıyor?',
      'Üç: tek şey değiştir. Aynı anda üç yeri düzeltirsen hangisinin işe yaradığını anlayamazsın.',
      'Dört: tekrar çalıştır.',
      'Adım adım düğmesi ve satır vurgusu tam olarak bunun için var.',
    ],
    ornek: [
      { kod: 'for (int i = 0; i < 5; i++)', not: 'Beklenen yedi tur, yazılan beş.' },
      { kod: 'while (!bitti) { don(); }', not: 'Konum değişmiyor, döngü hiç bitmiyor.' },
      { kod: 'if (...) { } else { sayac++; }', not: 'Doğru satır, yanlış dal.' },
    ],
    hatirla: 'Önce çalıştır, sonra karşılaştır, sonra tek bir şey değiştir.',
  },
  {
    bolum: 27,
    baslik: 'bool: evet mi hayır mı',
    neden:
      'Sayaçlar "kaç tane" sorusunu cevaplar. Bazı sorular ise evet ya da hayırla cevaplanır.',
    nasil: [
      '`bool` yalnızca iki değer alır: `true` ve `false`.',
      'Bir `bool` değişkenini doğrudan koşula yazabilirsin.',
      '`if (ilkDonus)` demek `if (ilkDonus == true)` ile aynıdır ve daha okunaklıdır.',
    ],
    ornek: [
      { kod: 'bool ilkDonus = true;', not: 'Başlangıçta evet.' },
      { kod: 'if (ilkDonus) {', not: 'Değeri doğruysa buraya girer.' },
      { kod: '  sagaDon();' },
      { kod: '  ilkDonus = false;', not: 'Bir daha girmesin diye hayıra çevir.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['######', '#S..##', '###.##', '###M##', '######'],
      yon: 'dogu',
      kod: 'bool dondum = false;\nwhile (!molaOdasindaMiyim()) {\n  if (onumdePaletVar() && !dondum) {\n    sagaDon();\n    dondum = true;\n  }\n  ilerle();\n}',
      anlat: 'Dönüş bir kere yapılıyor. İkinci kez olmaması `dondum` sayesinde.',
    },
    hatirla: '`bool` iki değerli bir bellektir. Bir olayın olup olmadığını hatırlar.',
  },
  {
    bolum: 28,
    baslik: 'Komutların birbirini çağırması',
    neden:
      'Kendi komutunu yazmayı öğrendin. Şimdi asıl güç geliyor: yazdığın komut, yine senin yazdığın başka bir komutu çağırabilir.',
    nasil: [
      'Bir fonksiyonun içinde `ilerle();` çağırabiliyorsan `koseDon();` de çağırabilirsin.',
      'Oyunun komutlarıyla senin komutların arasında fark yoktur.',
      'Küçük parçalardan daha büyük parçalar kurarsın.',
    ],
    ornek: [
      { kod: 'void koseDon() {', not: 'Küçük parça.' },
      { kod: '  sagaDon();' },
      { kod: '  ilerle();' },
      { kod: '}' },
      { kod: '', not: '' },
      { kod: 'void basamak() {', not: 'Büyük parça.' },
      { kod: '  ilerle();' },
      { kod: '  koseDon();', not: 'Kendi yazdığın komutu kullanıyor.' },
      { kod: '}' },
    ],
    demo: {
      harita: ['######', '#S.###', '##..##', '###M##', '######'],
      yon: 'dogu',
      kod: 'void koseDon() {\n  sagaDon();\n  ilerle();\n  solaDon();\n}\nvoid basamak() {\n  ilerle();\n  koseDon();\n}\n--- main ---\nbasamak();\nbasamak();',
      anlat: 'Tek bir `basamak();` çağrısı, içindeki `koseDon();` sayesinde dört komut çalıştırıyor.',
    },
    hatirla:
      'Fonksiyonlar birbirini çağırabilir. Karmaşık iş, isimlendirilmiş küçük işlere bölünür.',
  },
  {
    bolum: 29,
    baslik: 'Kalanla ritim kurmak',
    neden:
      '"Üçüncü adımda dön" demek kolay. Peki "her üç adımda bir dön"? Altıncıda, dokuzuncuda da dönmesi gerekiyor.',
    nasil: [
      '`%` işleci bölmeden kalanı verir.',
      '`9 % 3` sıfırdır, çünkü dokuz üçe tam bölünür.',
      '`10 % 3` ise birdir.',
      'Bu yüzden `adim % 3 == 0` tam olarak üçün katlarında doğru olur.',
    ],
    ornek: [
      { kod: '6 % 3', not: 'Kalan sıfır. Altı, üçün katı.' },
      { kod: '7 % 3', not: 'Kalan bir. Katı değil.' },
      { kod: 'if (adim % 3 == 0)', not: 'Her üçüncü turda doğru.' },
    ],
    demo: {
      harita: ['#####', '#S..#', '#...#', '#..M#', '#####'],
      yon: 'dogu',
      kod: 'int adim = 0;\nwhile (!molaOdasindaMiyim()) {\n  if (adim > 0 && adim % 2 == 0) {\n    sagaDon();\n  }\n  ilerle();\n  adim++;\n}',
      anlat: 'Bu örnekte her iki adımda bir dönüyor. Tek satır, tekrar eden bir düzen.',
    },
    hatirla: '`%` bölmeden kalanı verir. Tekrar eden düzeni yakalamanın en kısa yolu.',
  },
  {
    bolum: 30,
    baslik: 'Özyineleme: kendini çağıran komut',
    neden:
      'Tekrarlamanın döngüden başka bir yolu daha var. Komut, işi bitmediyse kendini yeniden çağırır.',
    nasil: [
      'İki parçası vardır ve ikisi de şarttır.',
      'Durma noktası: işin bittiği durum. Orada kendini çağırmaz.',
      'Küçültme: her çağrıda hedefe biraz daha yaklaşır.',
      'Durma noktasını unutursan program hiç bitmez.',
    ],
    ornek: [
      { kod: 'void yuru() {' },
      { kod: '  if (!molaOdasindaMiyim()) {', not: 'Durma noktası.' },
      { kod: '    ilerle();', not: 'Küçültme: bir adım yaklaş.' },
      { kod: '    yuru();', not: 'Kalan işi aynı komuta devret.' },
      { kod: '  }' },
      { kod: '}' },
    ],
    demo: {
      harita: koridor(4),
      yon: 'dogu',
      kod: 'void yuru() {\n  if (!molaOdasindaMiyim()) {\n    ilerle();\n    yuru();\n  }\n}\n--- main ---\nyuru();',
      anlat: 'Tek bir çağrı bütün koridoru yürüyor. Hiçbir yerde döngü yok.',
    },
    hatirla: 'Özyinelemede zor olan başlamak değil, durmayı hatırlamaktır.',
  },
  {
    bolum: 31,
    baslik: 'Döngü sayacını parametreye vermek',
    neden:
      'Döngünün sayacını şimdiye kadar sadece "kaç kere döneceğim" diye kullandın. O bir sayı ve her turda değişiyor.',
    nasil: [
      '`for (int i = 1; i <= 3; i++)` döngüsünde `i` sırayla bir, iki, üç olur.',
      '`ilerleN(i);` yazdığında fonksiyon her turda farklı sayı alır.',
      'Önce bir adım, sonra iki, sonra üç.',
      'Az kodla çok iş yapmanın en tipik örneği budur.',
    ],
    ornek: [
      { kod: 'for (int i = 1; i <= 3; i++) {', not: 'i sırayla 1, 2, 3.' },
      { kod: '  ilerleN(i);', not: 'Her turda farklı uzunlukta kenar.' },
      { kod: '  sagaDon();' },
      { kod: '}' },
    ],
    demo: {
      harita: ['#####', '#S..#', '#...#', '#.M.#', '#####'],
      yon: 'dogu',
      kod: 'void ilerleN(int n) {\n  for (int i = 0; i < n; i++) {\n    ilerle();\n  }\n}\n--- main ---\nfor (int i = 1; i <= 2; i++) {\n  ilerleN(i);\n  sagaDon();\n}',
      anlat: 'İlk turda bir adım, ikinci turda iki. Kenar her turda uzuyor.',
    },
    hatirla: 'Döngünün sayacı sadece tekrar sayısı değil, kullanabileceğin bir değerdir.',
  },
];

export const dersBul = (bolumNo: number): Ders | undefined =>
  DERSLER.find((d) => d.bolum === bolumNo);

export const vardiyaBul = (no: number): Vardiya | undefined =>
  VARDIYALAR.find((v) => v.no === no);

/** O bölüme kadar açılmış bütün dersler. Kavram sözlüğü bunu gösterir. */
export const acilanDersler = (bolumNo: number): readonly Ders[] =>
  DERSLER.filter((d) => d.bolum <= bolumNo);
