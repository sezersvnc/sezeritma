/**
 * Dersler.
 *
 * Oyunun asıl öğretme yükü burada. Bölüm görevleri alıştırma yaptırıyor;
 * bu kartlar kavramın kendisini anlatıyor. Kural: her ders önce **neden**
 * ihtiyaç duyulduğunu söyler, sonra **nasıl** çalıştığını, sonra satır satır
 * bir örnek gösterir. Cevabı vermez — bölümün çözümü hiçbir zaman burada yazmaz.
 */

export interface OrnekSatir {
  kod: string;
  not?: string;
}

export interface Ders {
  /** Bu ders hangi bölüm açılırken gösterilir. */
  bolum: number;
  baslik: string;
  /** Hangi problemi çözüyor. Kavramdan önce problem gelir. */
  neden: string;
  /** Nasıl çalışıyor. */
  nasil: string;
  ornek: OrnekSatir[];
  /** Tek cümlelik kalıcı özet. Kavram sözlüğünde de bu görünür. */
  hatirla: string;
}

export interface Vardiya {
  no: 1 | 2 | 3 | 4 | 5;
  ad: string;
  giris: string;
  ozet: string;
}

export const VARDIYALAR: readonly Vardiya[] = [
  {
    no: 1,
    ad: 'Üretim Hattı',
    giris:
      'Bilgisayar kendi başına hiçbir şey bilmez. Ona ne yapacağını tek tek, sırayla söylemen gerekir. Bu vardiyada Sezer\'i elle yönetmeyi öğreneceksin.',
    ozet:
      'Artık bir bilgisayara komut verebiliyorsun: komutlar yazdığın sırayla, yukarıdan aşağıya çalışır ve her birinin sonunda noktalı virgül vardır. Bir sonraki vardiyada aynı komutu tekrar tekrar yazmanın neden kötü bir fikir olduğunu göreceksin.',
  },
  {
    no: 2,
    ad: 'İstif Deposu',
    giris:
      'Bir programcının en sevmediği şey aynı şeyi iki kere yazmaktır. Bu vardiya sana neden böyle olduğunu ve döngülerin bunu nasıl çözdüğünü gösterecek.',
    ozet:
      'Döngü öğrendin: tekrarı sen değil bilgisayar yapıyor. `for` kaç kere döneceğini bildiğinde işe yarar. Ama her zaman bilmezsin — sıradaki vardiya tam olarak bununla ilgili.',
  },
  {
    no: 3,
    ad: 'Sevkiyat Bölgesi',
    giris:
      'Şimdiye kadar her şeyi önceden biliyordun: kaç adım, nereye. Gerçek problemlerde bilmezsin. Bu vardiyada program kendi kararını vermeyi öğrenecek.',
    ozet:
      'Programın artık karar verebiliyor: `while` bilinmeyen sayıda tekrarı, `if / else` de duruma göre farklı davranmayı sağlıyor. Bu ikisi birleşince ortaya bir **algoritma** çıkıyor — ezberlenmiş bir yol değil, her labirenti çözen bir kural.',
  },
  {
    no: 4,
    ad: 'Gece Vardiyası',
    giris:
      'Son vardiya. Programın bir şey hatırlayabilecek ve kendi komutlarını tanımlayabilecek. Gerçek programcılığa en yakın olduğun yer burası.',
    ozet:
      'Bitti. Değişkenle bilgi saklamayı, koşulları birleştirmeyi ve kendi fonksiyonunu yazmayı öğrendin. Bu dördü — sıra, tekrar, karar, isimlendirme — bugüne kadar yazılmış her programın temel taşları. Hangi dili öğrenirsen öğren, aynı dördü göreceksin.',
  },
  {
    no: 5,
    ad: 'Hata Ayıklama',
    giris:
      'Şimdiye kadar hep sen yazdın. Bu vardiyada kodu başkası yazdı ve çalışmıyor. Gerçek hayatta bir programcının zamanının büyük kısmı burada geçer: yazmakta değil, neden çalışmadığını bulmakta.',
    ozet:
      'Artık bozuk bir kodu okuyup düzeltebiliyorsun. Bu, kod yazmaktan daha zor ve daha değerli bir beceri — çünkü kendi yazdığın kod da bir gün çalışmayacak, ve o gün bu bölümlerde öğrendiğin refleksi kullanacaksın.',
  },
];

export const DERSLER: readonly Ders[] = [
  {
    bolum: 1,
    baslik: 'Algoritma nedir?',
    neden: [
      'Kod yazmayı hiç bilmiyor olabilirsin. Sorun değil — programlamanın özü kod değil, algoritma. Ve algoritma zaten bildiğin bir şey.',
      'Birine çay yapmayı tarif ettiğini düşün: suyu koy, kaynat, demliği yerleştir, beş dakika bekle. Sırayı bozarsan çay olmaz. Adımı atlarsan çay olmaz. İşte bu bir algoritma: bir işi yapan, sırası önemli, eksiksiz adımlar dizisi.',
    ].join('\n\n'),
    nasil: [
      'Bilgisayarın senden tek farkı, hiçbir şeyi kendiliğinden anlamaması. "Çayı demle" demek yetmez; her adımı tek tek söylemen gerekir. Bu oyunda da Sezer\'e ne yapacağını adım adım söyleyeceksin.',
      'Bu ilk bölümlerde kod yazmayacaksın. Aşağıdaki komut kartlarına basacaksın, satırlar senin yerine yazılacak. Sen sadece sıraya karar vereceksin — yani asıl işi, algoritmayı kuracaksın. Yazmaya sonra geçeceğiz.',
    ].join('\n\n'),
    ornek: [
      { kod: 'suyu koy;', not: 'Adımlar sırayla yapılır.' },
      { kod: 'kaynat;', not: 'Sırayı bozarsan sonuç bozulur.' },
      { kod: 'demle;', not: 'Bilgisayar tam olarak dediğini yapar, fazlasını değil.' },
    ],
    hatirla:
      'Algoritma, bir işi yapan sıralı ve eksiksiz adımlar dizisidir. Programlama, o adımları bilgisayarın anlayacağı dilde yazmaktır.',
  },
  {
    bolum: 2,
    baslik: 'Komut ve sıra',
    neden:
      'Bilgisayar sezgi kullanmaz. "Mola odasına git" demek işe yaramaz; oraya nasıl gidileceğini adım adım söylemen gerekir. Programlama tam olarak budur: bir işi bilgisayarın yapabileceği kadar küçük parçalara bölmek.',
    nasil:
      'Her komut bir satırdır ve sonunda noktalı virgül bulunur. Noktalı virgül C++ için cümlenin noktası gibidir: "bu komut bitti" demektir. Unutursan bilgisayar iki satırı tek cümle sanır ve şaşırır.',
    ornek: [
      { kod: 'ilerle();', not: 'Baktığın yöne bir kare gidersin.' },
      { kod: 'ilerle();', not: 'Bir kare daha. İki satır, iki adım.' },
    ],
    hatirla: 'Komutlar yazdığın sırayla, yukarıdan aşağıya çalışır. Her satırın sonunda noktalı virgül vardır.',
  },
  {
    bolum: 3,
    baslik: 'Durum: nereye baktığın önemli',
    neden:
      '`ilerle();` "sağa git" demek değil, "baktığın yöne git" demektir. Yani aynı komut, Sezer\'in o anki durumuna göre farklı sonuç verir. Bu, programlamanın en önemli fikirlerinden biri: komutun etkisi duruma bağlıdır.',
    nasil:
      '`sagaDon();` ve `solaDon();` Sezer\'i yerinde çevirir. Bir kare bile ilerlemez, sadece bakış yönü değişir. Sonraki `ilerle();` artık yeni yöne gider.',
    ornek: [
      { kod: 'ilerle();', not: 'Doğuya bakıyor, doğuya gider.' },
      { kod: 'sagaDon();', not: 'Yerinde döner. Konumu aynı, yönü artık güney.' },
      { kod: 'ilerle();', not: 'Aynı komut, bu sefer aşağı gider.' },
    ],
    hatirla: 'Dönmek ilerlemek değildir. Aynı komut, farklı durumda farklı sonuç verir.',
  },
  {
    bolum: 5,
    baslik: 'Tekrarın problemi',
    neden:
      'Bu bölümde aynı komutu on iki kere yazacaksın ve sıkılacaksın. Bu kasıtlı. Sıkılman gerekiyor, çünkü bir sonraki bölümde öğreneceğin şeyin neden var olduğunu ancak böyle anlarsın.',
    nasil:
      'Yazarken şunu düşün: koridor on iki değil de iki yüz kare olsaydı ne yapacaktın? Ya da uzunluğunu bilmeseydin? Kopyala-yapıştır bir çözüm değildir; hata yapılacak on iki ayrı yer demektir.',
    ornek: [
      { kod: 'ilerle();' },
      { kod: 'ilerle();' },
      { kod: '...', not: 've böyle on iki kere. Sıkıcı, uzun, hataya açık.' },
    ],
    hatirla: 'Aynı şeyi iki kere yazıyorsan, muhtemelen daha iyi bir yolu vardır.',
  },
  {
    bolum: 6,
    baslik: 'for döngüsü',
    neden:
      'Geçen bölümde on iki satır yazdın. Şimdi aynı işi üç satırda yapacaksın. Tekrarı sen değil bilgisayar yapacak — zaten iyi olduğu tek şey bu.',
    nasil:
      'Döngü, süslü parantezlerin içindeki komutları belirlediğin sayıda tekrarlar. `for` başlığındaki üç bölüm sırayla şunu söyler: sayaç nereden başlasın, ne zamana kadar devam etsin, her turda nasıl değişsin.',
    ornek: [
      { kod: 'for (int i = 0; i < 12; i++) {', not: 'i sıfırdan başlar, 12 olana kadar sürer, her turda bir artar. Yani 12 tur.' },
      { kod: '  ilerle();', not: 'Süslü parantezin içindekiler her turda çalışır.' },
      { kod: '}', not: 'Döngünün sonu. Buraya gelince başa döner.' },
    ],
    hatirla: '`for`, kaç kere tekrarlanacağını önceden bildiğin durumlar içindir.',
  },
  {
    bolum: 7,
    baslik: 'Döngü gövdesi',
    neden:
      'Tekrarlanan şey her zaman tek bir komut değildir. Çoğu zaman bir hareket dizisidir: iki adım at, bir şey al, tekrar. Döngü bunu da yapabilir.',
    nasil:
      'Süslü parantezlerin arasına istediğin kadar komut koyabilirsin. Hepsi, yazdığın sırayla, her turda baştan sona çalışır. Döngünün "gövdesi" denen şey budur.',
    ornek: [
      { kod: 'for (int i = 0; i < 3; i++) {' },
      { kod: '  ilerle();', not: 'Her turda önce bu,' },
      { kod: '  kap();', not: 'sonra bu çalışır. Üç turda altı komut.' },
      { kod: '}' },
    ],
    hatirla: 'Döngü tek komutu değil, gövdesindeki bütün komut dizisini tekrarlar.',
  },
  {
    bolum: 8,
    baslik: 'İç içe döngü',
    neden:
      'Bazen tekrarın kendisi de tekrarlanır. "Her kenarda dört adım at, sonra köşeyi dön — bunu üç kenar için yap" cümlesinde iki ayrı tekrar var, biri diğerinin içinde.',
    nasil:
      'Bir döngünün gövdesine başka bir döngü koyabilirsin. Dıştaki her bir turunda, içteki döngü baştan sona çalışır. Yani 3 dış tur × 4 iç tur = 12 kez.',
    ornek: [
      { kod: 'for (int i = 0; i < 3; i++) {', not: 'Dış döngü: kenarları sayar.' },
      { kod: '  for (int j = 0; j < 4; j++) {', not: 'İç döngü: o kenardaki kareleri sayar.' },
      { kod: '    ilerle();', not: 'Toplam 12 kere çalışır.' },
      { kod: '  }' },
      { kod: '  sagaDon();', not: 'İç döngü bitince, her dış turda bir kez.' },
      { kod: '}' },
    ],
    hatirla: 'İç içe döngüde iç kısım, dıştaki her tur için baştan sona çalışır.',
  },
  {
    bolum: 9,
    baslik: 'while döngüsü',
    neden:
      '`for` kaç kere döneceğini bildiğinde işe yarar. Ama gerçek problemlerde çoğu zaman bilmezsin. Koridorun uzunluğunu bilmiyorsun — bildiğin tek şey ne zaman durman gerektiği.',
    nasil:
      '`while` bir koşula bakar. Koşul doğru olduğu sürece gövdesini tekrarlar; yanlış olduğu anda durur. Sayı saymaz, duruma bakar. `!` işareti "değil" demektir: `!molaOdasindaMiyim()` yani "mola odasında değilken".',
    ornek: [
      { kod: 'while (!molaOdasindaMiyim()) {', not: 'Her turun başında koşulu kontrol eder.' },
      { kod: '  ilerle();', not: 'Koşul doğruysa çalışır, sonra tekrar kontrole döner.' },
      { kod: '}', not: 'Koşul yanlış olduğu an döngü biter.' },
    ],
    hatirla:
      '`while` sayıya değil koşula bakar. Koşulu yanlış yapacak bir şey döngü içinde olmazsa program hiç bitmez.',
  },
  {
    bolum: 10,
    baslik: 'if: karar vermek',
    neden:
      'Şimdiye kadar programın hep aynı şeyi yapıyordu. Ama önünde palet olup olmaması duruma göre değişir. Programın bakması, görmesi ve ona göre davranması gerekir.',
    nasil:
      '`if` parantezin içindeki koşula bakar. Doğruysa süslü parantezin içini çalıştırır, yanlışsa hiç uğramadan geçer. Bu, programın ilk kez "düşünmesi"dir.',
    ornek: [
      { kod: 'if (onumdePaletVar()) {', not: 'Sadece palet varsa içeri girer.' },
      { kod: '  sagaDon();', not: 'Palet yoksa bu satır hiç çalışmaz.' },
      { kod: '}' },
      { kod: 'ilerle();', not: 'Bu satır her durumda çalışır, if\'in dışında.' },
    ],
    hatirla: '`if` koşul doğruysa çalışır, yanlışsa atlanır. Girinti kimin nereye ait olduğunu gösterir.',
  },
  {
    bolum: 11,
    baslik: 'if / else: iki yol',
    neden:
      'Bazen "koşul doğruysa şunu yap" yetmez; "değilse de şunu yap" demen gerekir. Çikolata varsa kap, yoksa ilerle — ikisi de bir şey yapmalı.',
    nasil:
      '`else`, `if` bloğunun hemen ardına gelir ve koşul yanlış olduğunda çalışır. İkisinden **tam olarak biri** çalışır, asla ikisi birden değil.',
    ornek: [
      { kod: 'if (ustumdeCikolataVar()) {', not: 'Koşul doğruysa...' },
      { kod: '  kap();', not: '...sadece bu çalışır.' },
      { kod: '} else {', not: 'Koşul yanlışsa...' },
      { kod: '  ilerle();', not: '...sadece bu çalışır.' },
      { kod: '}' },
    ],
    hatirla: '`if / else` iki yoldan birini seçer. Üçüncü bir durum varsa `else if` eklersin.',
  },
  {
    bolum: 12,
    baslik: 'Algoritma nedir',
    neden:
      'Bu labirentin yolunu ezberleyip komutları tek tek yazabilirdin. Ama o çözüm sadece bu labirent için işe yarar. Programcının aradığı şey başka: **bütün labirentleri** çözen bir kural.',
    nasil:
      'Algoritma, bir problemi çözen adım adım kuraldır. Buradaki kural tek cümle: "önünde palet varsa sağa dön, yoksa ilerle." Bu kuralı bir döngünün içine koyduğunda labirentin şeklini hiç bilmene gerek kalmaz — kural her durumda doğru kararı verir.\n\nİşin güzeli şu: bu senin uydurduğun bir numara değil, gerçek bir algoritma. Adı duvar takibi ve gerçek robotlar bunu kullanıyor.',
    ornek: [
      { kod: 'while (bitmedi) {', not: 'Tekrar: kuralı sürekli uygula.' },
      { kod: '  if (engel var) don();', not: 'Karar: duruma göre davran.' },
      { kod: '  else ilerle();', not: 'Üç satır, sınırsız labirent.' },
      { kod: '}' },
    ],
    hatirla:
      'Algoritma tek bir problemi değil, bir problem ailesini çözer. "Bu labirent" için değil, "her labirent" için yazarsın.',
  },
  {
    bolum: 13,
    baslik: 'Değişken: hatırlamak',
    neden:
      'Şimdiye kadar programın hiçbir şey hatırlamıyordu. Kaç çikolata topladığını sorsan bilemezdi. Ama çoğu problem bir şeyi akılda tutmayı gerektirir.',
    nasil:
      '`int sayac = 0;` bilgisayarın belleğinde `sayac` adında bir kutu açar ve içine 0 koyar. `int` "içine tam sayı girer" demektir. `sayac++` kutudaki sayıyı bir artırır. Sağdaki panelden değerin canlı değiştiğini görebilirsin.',
    ornek: [
      { kod: 'int sayac = 0;', not: 'Kutuyu aç, sıfırla. Bir kere, döngüden önce.' },
      { kod: 'while (...) {' },
      { kod: '  kap();' },
      { kod: '  sayac++;', not: 'Her kaptığında bir artır. 0 → 1 → 2 ...' },
      { kod: '}' },
    ],
    hatirla:
      'Değişken, programın belleğidir. Döngüden **önce** tanımlanır, döngünün **içinde** değişir.',
  },
  {
    bolum: 14,
    baslik: 'Koşulları birleştirmek',
    neden:
      'Bazen durman için tek bir sebep yoktur. "Beş çikolata topladıysam dur, ama mola odasına vardıysam da dur" — iki ayrı sebep, tek döngü.',
    nasil:
      '`&&` işareti "ve" demektir: iki koşul da doğruysa sonuç doğrudur. Biri bile yanlışsa döngü durur. Kardeşi `||` ise "veya" demektir: birinin doğru olması yeter. `!` ise "değil": doğruyu yanlışa çevirir.',
    ornek: [
      { kod: 'while (sayac < 5 && !molaOdasindaMiyim()) {', not: 'İki koşul da doğruyken devam.' },
      { kod: '  ...', not: 'Beş oldu ya da molaya varıldıysa döngü biter.' },
      { kod: '}' },
    ],
    hatirla: '`&&` ikisi de, `||` biri yeter, `!` tersi. Karmaşık kararlar bu üçünden kurulur.',
  },
  {
    bolum: 15,
    baslik: 'Fonksiyon: kendi komutun',
    neden:
      'Bir hareket dizisini tekrar tekrar yazıyorsan, ona bir isim verebilirsin. O andan itibaren o dizi senin için tek bir komuttur. Programcılığın en güçlü fikri budur: karmaşıklığı isimlerin arkasına saklamak.',
    nasil:
      'Editörde `main()`\'in üstünde ikinci bir bölme açıldı. Orada `void koseDon() { }` yazıp içine komutları koyarsın. Sonra `main()` içinde `koseDon();` diye çağırırsın — tıpkı `ilerle();` gibi. `void` "geriye bir değer döndürmez, sadece iş yapar" demektir.',
    ornek: [
      { kod: 'void koseDon() {', not: 'Tanım: bu isim ne yapacak?' },
      { kod: '  sagaDon();' },
      { kod: '  ilerle();' },
      { kod: '}', not: 'Tanım burada biter. Henüz hiçbir şey çalışmadı.' },
      { kod: '', not: '' },
      { kod: 'koseDon();', not: 'Çağrı: içindeki iki komut şimdi çalışır.' },
    ],
    hatirla:
      'Fonksiyon tanımlamak onu çalıştırmaz; çağırmak çalıştırır. İsmi ne yaptığını anlatsın.',
  },
  {
    bolum: 16,
    baslik: 'Hepsi bir arada',
    neden:
      'Son bölüm yeni bir kavram öğretmiyor. Öğrendiğin dördünü aynı anda kullanman gerekiyor — gerçek programlar da böyledir.',
    nasil:
      'Şimdiye kadarki her şey aslında dört fikirdi:\n\n**Sıra** — komutlar yazdığın düzende çalışır.\n**Tekrar** — `for` ve `while` aynı işi defalarca yapar.\n**Karar** — `if / else` duruma göre yol ayırır.\n**İsimlendirme** — değişkenler bilgiye, fonksiyonlar davranışa isim verir.\n\nHangi programlama dilini öğrenirsen öğren, aynı dördünü göreceksin. Sözdizimi değişir, bu dört fikir değişmez.',
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
    bolum: 17,
    baslik: 'Hata ayıklama',
    neden:
      'Kod yazmak işin kolay yarısı. Çalışmayan bir kodu okuyup neyin yanlış olduğunu bulmak asıl beceridir — ve kimse bunu doğuştan bilmez, herkes alıştırmayla öğrenir.',
    nasil: [
      'Sırası şu ve hiç değişmez.',
      '1 — Çalıştır. Tahmin etme, gör. Kod gerçekte ne yapıyor?',
      '2 — Karşılaştır. Ne yapmasını istiyordun, ne yaptı? Fark tam olarak nerede başlıyor?',
      '3 — Tek şey değiştir. Aynı anda üç yeri düzeltirsen hangisinin işe yaradığını anlayamazsın.',
      '4 — Tekrar çalıştır. Düzeldi mi, yoksa başka bir yeri mi bozdun?',
      'Adım adım düğmesi ve satır vurgusu tam olarak bunun için var: kodun hangi satırda ne yaptığını tek tek izleyebilirsin.',
    ].join('\n\n'),
    ornek: [
      { kod: 'for (int i = 0; i < 5; i++)', not: 'Beklenen 7 tur, yazılan 5. Kod çalışır ama yanlış çalışır.' },
      { kod: 'while (!bitti) { don(); }', not: 'Konumu değiştiren bir şey yok — sonsuz döngü.' },
      { kod: 'if (...) { } else { sayac++; }', not: 'Doğru satır, yanlış dal. Sayaç yanlış şeyi sayar.' },
    ],
    hatirla:
      'Önce çalıştır, sonra karşılaştır, sonra tek bir şey değiştir. Hata mesajını okumak, tahmin etmekten her zaman hızlıdır.',
  },
];

export const dersBul = (bolumNo: number): Ders | undefined =>
  DERSLER.find((d) => d.bolum === bolumNo);

export const vardiyaBul = (no: number): Vardiya | undefined =>
  VARDIYALAR.find((v) => v.no === no);

/** O bölüme kadar açılmış bütün dersler — kavram sözlüğü bunu gösterir. */
export const acilanDersler = (bolumNo: number): readonly Ders[] =>
  DERSLER.filter((d) => d.bolum <= bolumNo);
