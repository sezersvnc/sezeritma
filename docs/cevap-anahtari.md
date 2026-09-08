# Cevap anahtarı

Bütün bölümlerin çalıştığı doğrulanmış çözümleri. `npm run cevap-anahtari` ile yeniden üretilir;
yani bölüm değişirse buradaki çözüm de otomatik güncellenir, elle düzeltmeye gerek yok.

Öğrenciye gösterilecek bir belge değil: oyunu anlatırken, demo yaparken ve takılan birine
yardım ederken kullanılıyor. Yazılan kod tam olarak `main()` gövdesine girer; `#include` ve
`int main()` satırlarını öğrenci zaten yazmıyor.

---

## 01 — Kıpırda Bakalım

**Vardiya 1 · ilerle() ve noktalı virgül**

Görev: Vardiya yeni başladı. Sezer bandın başında duruyor. Onu sağdaki mola odasına götür.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 2 adım

```cpp
ilerle();
ilerle();
```

1. ipucu: Sezer'i hareket ettiren tek bir komut var. Sağdaki listede duruyor.

2. ipucu: Alt alta iki kere `ilerle();` yaz. Satır sonundaki noktalı virgülü unutma, C++ onsuz çalışmaz.

Vardiya notu: Vardiya başladı. Sezer henüz hiçbir şey kapmadı. Henüz.

## 02 — Üç Adım Ötede

**Vardiya 1 · sıralı çalışma**

Görev: Mola odası üç adım ötede. Komutlar yukarıdan aşağıya doğru sırayla çalışır.

Hedef 3 satır · bu çözüm 3 satır · çikolata 0 · 3 adım

```cpp
ilerle();
ilerle();
ilerle();
```

1. ipucu: Hedefe ulaşmak için Sezer'in üç kare gitmesi gerekiyor.

2. ipucu: Alt alta üç kez `ilerle();` yaz.

Vardiya notu: 3 adım atıldı, 0 çikolata yendi. Sezer performansıyla göz dolduruyor.

## 03 — Koridoru Dön

**Vardiya 1 · sagaDon() ve solaDon()**

Görev: Koridor sağa kıvrılıyor. Sezer'i duvara çarptırmadan mola odasına ulaştır.

Hedef 5 satır · bu çözüm 5 satır · çikolata 0 · 5 adım

```cpp
ilerle();
ilerle();
sagaDon();
ilerle();
ilerle();
```

1. ipucu: Sezer'in döndüğü karede ilerlemediğini unutma. Sadece olduğu yerde yönünü değiştirir.

2. ipucu: İki kez ilerle, sonra `sagaDon();` kullan ve hedefe varmak için tekrar iki kez ilerle.

Vardiya notu: Amir köşeyi dönerken Sezer'i gördü mü? Hayır. Mükemmel.

## 04 — İlk Çikolata

**Vardiya 1 · kap()**

Görev: Yerde bir çikolata var! Tam üstüne git, `kap();` komutuyla al ve mola odasına geç.

Hedef 5 satır · bu çözüm 5 satır · çikolata 1 · 5 adım

```cpp
ilerle();
ilerle();
kap();
ilerle();
ilerle();
```

1. ipucu: Çikolatayı uzaktan alamazsın. Önce tam üstünde durduğun kareye gelmelisin.

2. ipucu: İki kere ilerle, `kap();` yaz, sonra hedefe ulaşmak için tekrar ilerle.

Vardiya notu: İlk çikolata cebe indi. Mesai artık daha tatlı.

## 05 — Zikzak Koridor

**Vardiya 1 · komutları doğru sırada birleştirmek**

Görev: Koridor iki kere kırılıyor ve yolda bir çikolata var. Sezer'i mola odasına ulaştır, çikolatayı da bırakma.

Hedef 11 satır · bu çözüm 11 satır · çikolata 1 · 11 adım

```cpp
ilerle();
sagaDon();
ilerle();
ilerle();
solaDon();
ilerle();
kap();
sagaDon();
ilerle();
solaDon();
ilerle();
```

1. ipucu: Yolu önce kafanda yürü: nerede dönmen, nerede kapman gerekiyor? Sonra aynı sırayla komutları diz.

2. ipucu: Bir ilerle, sağa dön, iki ilerle, sola dön, bir ilerle, kap, sağa dön, bir ilerle, sola dön, bir ilerle.

Vardiya notu: On bir satır. Sezer yoruldu ama vardiyanın ilk yarısı bitti.

## 06 — Upuzun Koridor

**Vardiya 2 · aynı komutu tekrar yazmanın zorluğu**

Görev: Bu depo koridoru gerçekten çok uzun. Mola odasına ulaşmak için sabırla yürümen gerek.

Hedef 12 satır · bu çözüm 12 satır · çikolata 0 · 12 adım

```cpp
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
ilerle();
```

1. ipucu: Evet, tek çaren aynı komutu defalarca alt alta yazmak. Başka sihirli bir yol şu an için yok.

2. ipucu: Tam 12 kez `ilerle();` yazman gerekiyor. Üçüncü yıldızı alamayacaksın ama merak etme, bu planın bir parçası.

Vardiya notu: Parmakların yoruldu mu? Merak etme, bir sonraki vardiyada bunun kolay yolunu öğreneceksin.

## 07 — Aynı Koridor, Tek Satır

**Vardiya 2 · for döngüsü**

Görev: Aynı upuzun koridor. Ama bu kez `for` döngüsü kullanabiliyorsun. Hedef satır sayısını aşmadan işi bitir.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 25 adım

```cpp
for (int i = 0; i < 12; i++) {
    ilerle();
}
```

1. ipucu: `for (int i = 0; i < 12; i++)` yapısı, içindeki komutları tam 12 kez çalıştırır.

2. ipucu: Döngüyü kur ve süslü parantezlerin `{ }` arasına sadece bir kez `ilerle();` yaz.

Vardiya notu: İşte mühendislik budur! Amelelik bitti, otomasyon başladı.

## 08 — Aralıklı Raflar

**Vardiya 2 · döngü gövdesi**

Görev: Çikolatalar raflara aralıklı dizilmiş. Süslü parantezin içine birden fazla komut koyarak hepsini topla.

Hedef 4 satır · bu çözüm 4 satır · çikolata 4 · 17 adım

```cpp
for (int i = 0; i < 4; i++) {
    ilerle();
    kap();
    ilerle();
}
```

1. ipucu: Tekrarlayan deseni bul: Sezer her seferinde bir adım atmalı, çikolatayı kapmalı, sonra bir adım daha atmalı.

2. ipucu: `for` döngüsünü 4 kez çalışacak şekilde ayarla. İçine sırayla `ilerle();`, `kap();` ve `ilerle();` yaz.

Vardiya notu: Döngüler sadece yürümek için değildir. 4 çikolata daha zulalandı!

## 09 — Kare Çiz

**Vardiya 2 · döngünün içinde yön değiştirmek**

Görev: Depo bloğunun etrafını dolaş. Her kenar aynı uzunlukta, her köşede aynı dönüş var.

Hedef 7 satır · bu çözüm 7 satır · çikolata 0 · 18 adım

```cpp
for (int i = 0; i < 3; i++) {
  ilerle();
  ilerle();
  ilerle();
  sagaDon();
}
ilerle();
ilerle();
```

1. ipucu: Tekrarlanan şey sadece ilerlemek değil: üç adım at, sonra dön. Bu dördü tek bir tekrar.

2. ipucu: Döngünün içine üç `ilerle();` ve bir `sagaDon();` koy, üç kenarı böyle dolaş, sonra kalan iki kareyi yürü.

Vardiya notu: Bir kare çizdin. Dönüşü döngünün içine koymak, kenar sayısı kadar kod yazmaktan iyidir.

## 10 — Bütün Depoyu Tara

**Vardiya 2 · iç içe for**

Görev: Kare şeklindeki büyük deponun kenarlarından dolanarak mola odasına ulaş. İç içe döngüler kullanmanın tam zamanı.

Hedef 4 satır · bu çözüm 4 satır · çikolata 0 · 34 adım

```cpp
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        ilerle();
    }
    sagaDon();
}
```

1. ipucu: Önce düz bir çizgiyi geçmek için bir `for` döngüsü yaz. Sonra bu döngüyü ve `sagaDon();` komutunu başka bir dış `for` döngüsünün içine al.

2. ipucu: Dıştaki döngü 3 kez (3 kenar için), içteki döngü ise 4 kez (her kenardaki adımlar için) çalışmalı.

Vardiya notu: Büyük deponun çevresi kısacık bir kodla dönüldü. Amiri bile ağlatacak bir mühendislik harikası.

## 11 — Koridorun Sonu Nerede?

**Vardiya 3 · while döngüsü**

Görev: Bu koridorun ne kadar uzun olduğunu bilmiyorsun. Mola odasına varana kadar ilerlemeye devam et.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 15 adım

```cpp
while (!molaOdasindaMiyim()) {
    ilerle();
}
```

1. ipucu: Kaç adım atacağını bilmediğin durumlarda `for` yerine `while` kullanmalısın.

2. ipucu: `while (!molaOdasindaMiyim())` döngüsünü kur ve içine sadece `ilerle();` yaz. Ünlem işareti "değilse" anlamına gelir.

Vardiya notu: Vardiya 3 başladı! Sonsuzluğa ve ötesine... ya da mola odasına kadar.

## 12 — Duvara Kadar

**Vardiya 3 · durma koşulunu seçmek**

Görev: Bu sefer koridorun sonunda ne olduğunu bilmiyorsun. Sezer'i duvara çarpmadan gidebildiği kadar götür.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 15 adım

```cpp
while (!onumdePaletVar()) {
  ilerle();
}
```

1. ipucu: Döngü ne zaman durmalı? Mola odasına varınca değil, önü kapanınca.

2. ipucu: `while (!onumdePaletVar())` yaz, içine sadece `ilerle();` koy. Önünde palet olduğu an duracak.

Vardiya notu: Aynı döngü, farklı durma koşulu. Doğru soruyu sormak, doğru cevabı bilmekten önce gelir.

## 13 — Palet Var mı?

**Vardiya 3 · if koşulu**

Görev: Koridorun sonunda bir palet yolu kapatıyor. Palete gelene kadar dümdüz git, paleti görünce sağa dönüp mola odasına ulaş.

Hedef 4 satır · bu çözüm 4 satır · çikolata 0 · 17 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (onumdePaletVar()) {
    sagaDon();
  }
  ilerle();
}
```

1. ipucu: `while` döngüsünün içinde her adımda palet olup olmadığını `if` ile kontrol edebilirsin.

2. ipucu: Döngü içine `if (onumdePaletVar())` yazıp süslü parantezlerin içinde `sagaDon();` komutunu kullan, döngünün sonuna da `ilerle();` ekle.

Vardiya notu: Paletlere çarpmadan ilerlemek iş güvenliği uzmanımızı çok sevindirdi.

## 14 — Rafta Ne Var?

**Vardiya 3 · if / else**

Görev: Yerde rastgele dağılmış çikolatalar var. Bastığın karede çikolata varsa kap, yoksa yoluna devam et.

Hedef 5 satır · bu çözüm 5 satır · çikolata 2 · 28 adım

```cpp
while (!molaOdasindaMiyim()) {
    if (ustumdeCikolataVar()) {
        kap();
    } else {
        ilerle();
    }
}
```

1. ipucu: Bu kez iki farklı durum var: çikolata varsa kapılacak, yoksa ilerlenecek. `else` tam da bunun için var.

2. ipucu: `if (ustumdeCikolataVar())` içine `kap();` yaz, hemen altına `else { ilerle(); }` ekle. Hepsini bir `while` döngüsüne sar.

Vardiya notu: Sezer'in cepleri doluyor. Karar mekanizmaları tıkır tıkır çalışıyor.

## 15 — Üç İhtimal

**Vardiya 3 · else if ile üçüncü yol**

Görev: Bu koridorda üç ayrı durum var: çikolata, palet ya da açık yol. Üçü için de ne yapacağını söylemen gerekiyor.

Hedef 7 satır · bu çözüm 7 satır · çikolata 2 · 39 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (ustumdeCikolataVar()) {
    kap();
  } else if (onumdePaletVar()) {
    sagaDon();
  } else {
    ilerle();
  }
}
```

1. ipucu: `if` ve `else` iki yol açıyor. Üçüncü bir durum varsa araya bir tane daha koyman gerek.

2. ipucu: `if (...) { } else if (...) { } else { }` sırasıyla çikolatayı kap, palete rastlayınca dön, kalan durumda ilerle.

Vardiya notu: Üç ihtimal, üç dal, tek döngü. Sezer artık her duruma hazır.

## 16 — Sevkiyat Labirenti

**Vardiya 3 · while ve if birlikte**

Görev: Sevkiyat bölgesi içe doğru kıvrılan tek bir koridor. Yolu ezberlemene gerek yok, çünkü bütün dönüşler aynı yöne.

Hedef 5 satır · bu çözüm 5 satır · çikolata 0 · 115 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (onumdePaletVar()) {
    sagaDon();
  } else {
    ilerle();
  }
}
```

1. ipucu: Bölüm 10'da yaptığının aynısı, ama bu sefer tek bir palet değil, koca bir labirent var. Mantık değişmiyor.

2. ipucu: Mola odasına gelene kadar dön: önünde palet varsa sağa dön, yoksa ilerle. `if / else` kullan.

Vardiya notu: Beş satır, koca bir labirent. Gözü kapalı bile çözerdin. Sevkiyat bölgesi tamam!

## 17 — Kaç Tane Kaptım?

**Vardiya 4 · değişkenler (int)**

Görev: Çikolataları toplarken sayısını aklında tutman gerek. Bir `sayac` değişkeni oluştur ve her çikolata kaptığında onu artır.

Hedef 7 satır · bu çözüm 7 satır · çikolata 3 · 32 adım

```cpp
int sayac = 0;
while (!molaOdasindaMiyim()) {
    if (ustumdeCikolataVar()) {
        kap();
        sayac++;
    } else {
        ilerle();
    }
}
```

1. ipucu: Döngüden önce `int sayac = 0;` diyerek başla. Çikolatayı kaptığın `if` bloğunun içinde sayacı artır.

2. ipucu: Sayacı artırmak için `sayac++;` ya da `sayac = sayac + 1;` yazabilirsin. Yan panelde sayacın değişimini izle.

Vardiya notu: Değişkenler devrede! Gece vardiyası matematik gerektirir.

## 18 — Sayarak Dön

**Vardiya 4 · değişkenin verdiği karar**

Görev: Depo bomboş, hiçbir duvar sana nerede döneceğini söylemiyor. Adımlarını sayman ve doğru anda dönmen gerekiyor.

Hedef 6 satır · bu çözüm 6 satır · çikolata 0 · 27 adım

```cpp
int adim = 0;
while (!molaOdasindaMiyim()) {
  if (adim == 3) {
    sagaDon();
  }
  ilerle();
  adim++;
}
```

1. ipucu: `onumdePaletVar()` burada işe yaramaz, çünkü ortalık açık. Kaç adım attığını yalnızca sen bilebilirsin.

2. ipucu: Bir `int adim = 0;` sayacı tut, her ilerlemede artır, `if (adim == 3)` olduğunda sağa dön.

Vardiya notu: Duvar yokken bile yolunu buldun. Sayaç, görmediğin şeyi bilmeni sağlar.

## 19 — Beş Tane Yeter

**Vardiya 4 · && ile iki koşulu birleştirmek**

Görev: Rafta tam beş çikolata var ve amir daha fazlasına göz yummaz. Beşini topla, sonra mola odasına geç.

Hedef 9 satır · bu çözüm 9 satır · çikolata 5 · 40 adım

```cpp
int sayac = 0;
while (sayac < 5 && !molaOdasindaMiyim()) {
  if (ustumdeCikolataVar()) {
    kap();
    sayac++;
  } else {
    ilerle();
  }
}
while (!molaOdasindaMiyim()) {
  ilerle();
}
```

1. ipucu: `while` döngünün içine iki şartı `&&` (ve) ile bağlayabilirsin: `(sayac < 5 && !molaOdasindaMiyim())`

2. ipucu: İlk `while` ile beş çikolatayı topla. Döngü bittiğinde hâlâ mola odasında değilsen, kalan yolu ikinci bir `while` ile yürü.

Vardiya notu: Nefsine hakim oldun ve beşte durdun. Ayın elemanı olmaya çok yakınsın.

## 20 — Kendi Kısayolum

**Vardiya 4 · void ile kendi fonksiyonunu yazmak**

Görev: Köşe dönmek için her seferinde `sagaDon(); ilerle();` yazmak yorucu. Kendi `koseDon()` komutunu yaz ve işi kısalt.

Hedef 7 satır · bu çözüm 7 satır · çikolata 0 · 15 adım

```cpp
void koseDon() {
  sagaDon();
  ilerle();
}
// --- buradan aşağısı main() içine ---
for (int i = 0; i < 4; i++) {
  ilerle();
}
koseDon();
koseDon();
```

1. ipucu: Üstteki yeni bölmede `void koseDon() { }` yapısını oluştur ve içine sağa dönüp ilerleme komutlarını koy.

2. ipucu: Alttaki ana bölmede önce köşeye kadar yürü, sonra kendi yazdığın `koseDon();` komutunu sanki oyunun bir parçasıymış gibi çağır.

Vardiya notu: Kendi komutunu icat ettin. Artık `koseDon();` diye bir şey var ve onu sen yazdın.

## 21 — Sayıyla Komut

**Vardiya 4 · parametre: komuta bilgi vermek**

Görev: Üç ayrı düzlük var ama uzunlukları farklı: üç, iki, üç adım. Her biri için ayrı komut yazmak yerine tek bir komuta kaç adım atacağını söyle.

Hedef 8 satır · bu çözüm 8 satır · çikolata 0 · 24 adım

```cpp
void ilerleN(int n) {
  for (int i = 0; i < n; i++) {
    ilerle();
  }
}
// --- buradan aşağısı main() içine ---
ilerleN(3);
sagaDon();
ilerleN(2);
solaDon();
ilerleN(3);
```

1. ipucu: Geçen bölümde yazdığın komut hep aynı işi yapıyordu. Bu sefer komutun sana kaç adım atacağını sorması gerek.

2. ipucu: `void ilerleN(int n)` diye tanımla, içine `n` kere dönen bir `for` koy. Sonra `ilerleN(3);` diye çağır.

Vardiya notu: Komutun artık soru soruyor: kaç adım? Tek bir isim, sonsuz farklı iş.

## 22 — Büyük Çikolata Soygunu

**Vardiya 4 · hepsini birden kullanmak**

Görev: Son vardiya, son görev. Labirentin her yerinde çikolata var. Öğrendiğin her şeyi birleştir, hepsini topla ve mola odasına zaferle gir.

Hedef 7 satır · bu çözüm 7 satır · çikolata 4 · 165 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (ustumdeCikolataVar()) {
    kap();
  } else if (onumdePaletVar()) {
    sagaDon();
  } else {
    ilerle();
  }
}
```

1. ipucu: Her karede üç ihtimal var: çikolata, palet, ya da açık yol. Üçü için üç ayrı davranış gerekiyor.

2. ipucu: `if` ile çikolatayı kap, `else if` ile palete rastlayınca dön, `else` ile ilerle. Tek döngü hepsini halleder.

Vardiya notu: Vardiya bitti. Dört çikolata, sıfır tanık. Sezer paydos kartını bastı.

## 23 — Bir Fazla, Bir Eksik

**Vardiya 5 · sınır hatası (off-by-one)**

Görev: Bu kodu senin için biri yazdı ama çalışmıyor. Önce çalıştır, ne olduğunu gör, sonra düzelt. Kodu silip baştan yazma; tek bir karakter yetiyor.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 15 adım

```cpp
for (int i = 0; i < 7; i++) {
  ilerle();
}
```

1. ipucu: Çalıştır ve Sezer'in nerede durduğuna bak. Mola odasına kaç kare kaldı?

2. ipucu: Döngü beş kere dönüyor ama koridor daha uzun. `i < 5` yazan yeri değiştir.

Vardiya notu: Bir eksik saymak, programcıların en meşhur hatasıdır. Artık sen de kulübün üyesisin.

## 24 — Hiç Bitmeyen Vardiya

**Vardiya 5 · sonsuz döngü**

Görev: Bu kod sonsuz döngüye giriyor. Çalıştır, oyunun sana ne söylediğini oku, sonra döngünün neden bitmediğini bul.

Hedef 4 satır · bu çözüm 4 satır · çikolata 0 · 23 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (onumdePaletVar()) {
    sagaDon();
  }
  ilerle();
}
```

1. ipucu: Döngünün içinde Sezer'in konumunu değiştiren bir şey var mı? Dönmek konum değiştirmez.

2. ipucu: Koşul "mola odasında değilken" diyor. Ama döngü içinde hiç ilerlenmiyorsa Sezer oraya nasıl varacak? Bir `ilerle();` eksik.

Vardiya notu: Sonsuz döngü bir hata değil, bir unutkanlıktır: koşulu yanlış yapacak şeyi yazmayı unutursun.

## 25 — Yanlış Yerdeki Satır

**Vardiya 5 · satırın yeri anlamı değiştirir**

Görev: Bu kod çalışıyor ama sayaç yanlış sayıyor. Çikolataları topluyor, sayaç ise hep bir adım geride. Satırlardan biri yanlış yerde.

Hedef 7 satır · bu çözüm 7 satır · çikolata 4 · 42 adım

```cpp
int sayac = 0;
while (!molaOdasindaMiyim()) {
  if (ustumdeCikolataVar()) {
    kap();
    sayac++;
  } else {
    ilerle();
  }
}
```

1. ipucu: Sayacı artıran satır hangi dalın içinde? Çikolata kapıldığında mı artıyor, ilerlendiğinde mi?

2. ipucu: `sayac++;` satırını `else` dalından alıp `kap();` satırının hemen altına taşı. Sayaç kapılanı saymalı, adımı değil.

Vardiya notu: Aynı satır, farklı yer, bambaşka program. Girintiler süs değil, anlamın kendisi.

## 26 — Ters Koşul

**Vardiya 5 · mantık hatası**

Görev: Bu kod hiç hata vermiyor, sadece hiçbir şey yapmıyor. Çalıştır, Sezer'in neden kıpırdamadığını bul.

Hedef 2 satır · bu çözüm 2 satır · çikolata 0 · 15 adım

```cpp
while (!molaOdasindaMiyim()) {
  ilerle();
}
```

1. ipucu: Döngü koşulu ne zaman doğru? Sezer başlangıçta mola odasında mı?

2. ipucu: Koşul tersine yazılmış. "Mola odasındayken devam et" değil, "mola odasında değilken devam et" olmalı. Başına bir `!` koy.

Vardiya notu: Tek bir ünlem işareti. Mantık hataları en sinsi olanlardır, çünkü program hata bile vermez.

## 27 — İlk Dönüş, Son Dönüş

**Vardiya 6 · bool ile evet-hayır hatırlamak**

Görev: İki kere döneceksin ama aynı yöne değil: ilkinde sağa, ikincisinde sola. Duvar ikisinde de aynı görünüyor, farkı senin hatırlaman gerek.

Hedef 9 satır · bu çözüm 9 satır · çikolata 0 · 28 adım

```cpp
bool ilkDonus = true;
while (!molaOdasindaMiyim()) {
  if (onumdePaletVar()) {
    if (ilkDonus) {
      sagaDon();
      ilkDonus = false;
    } else {
      solaDon();
    }
  }
  ilerle();
}
```

1. ipucu: `onumdePaletVar()` sana duvarı söyler ama kaçıncı duvar olduğunu söylemez. Bunu ancak sen tutabilirsin.

2. ipucu: `bool ilkDonus = true;` diye başla. İlk dönüşte sağa dön ve değeri `false` yap; sonrakinde sola dön.

Vardiya notu: Bir evet, bir hayır. Bazen tüm program tek bir hatırlanan cevaba bakar.

## 28 — Komut İçinde Komut

**Vardiya 6 · fonksiyonun başka fonksiyonu çağırması**

Görev: Merdiven yine karşında ama bu sefer iki isim kullan: köşe dönüşünü ayrı bir komut yap, basamağı da onu çağıran bir komut olarak yaz.

Hedef 10 satır · bu çözüm 10 satır · çikolata 0 · 18 adım

```cpp
void koseDon() {
  sagaDon();
  ilerle();
  solaDon();
}
void basamak() {
  ilerle();
  koseDon();
}
// --- buradan aşağısı main() içine ---
basamak();
basamak();
basamak();
```

1. ipucu: Bir fonksiyonun içinde `ilerle();` çağırabiliyorsan, kendi yazdığın başka bir komutu da çağırabilirsin.

2. ipucu: Önce `void koseDon()` yaz: sağa dön, ilerle, sola dön. Sonra `void basamak()` yaz: ilerle ve `koseDon();` çağır. Ana bölmede üç kere `basamak();` demen yeterli.

Vardiya notu: İsimler üst üste bindi. Büyük programlar tam olarak böyle kurulur: küçük komutlar, birbirini çağırarak.

## 29 — Her Üç Adımda Bir

**Vardiya 6 · % ile ritim yakalamak**

Görev: Depo bomboş, hiçbir duvar sana yol göstermiyor. Üç adımda bir dönerek kareyi tamamla ve mola odasına in.

Hedef 6 satır · bu çözüm 6 satır · çikolata 0 · 40 adım

```cpp
int adim = 0;
while (!molaOdasindaMiyim()) {
  if (adim > 0 && adim % 3 == 0) {
    sagaDon();
  }
  ilerle();
  adim++;
}
```

1. ipucu: Sayaç üçe geldiğinde dönmek yetmez; altıda, dokuzda da dönmen gerekiyor. Tek tek yazmak yerine bir kalıp lazım.

2. ipucu: `%` işleci bölmeden kalanı verir. `adim % 3 == 0` ifadesi üçün katlarında doğru olur; başlangıçtaki sıfırı dışarıda tutmak için `adim > 0` şartını da ekle.

Vardiya notu: Üç, altı, dokuz. Tek satırda sonsuz bir ritim kurdun.

## 30 — Kendini Çağıran Komut

**Vardiya 6 · özyineleme**

Görev: Bu koridoru döngüsüz geç. Yazacağın komut, işi bitmediyse kendini yeniden çağırsın.

Hedef 5 satır · bu çözüm 5 satır · çikolata 0 · 23 adım

```cpp
void yuru() {
  if (!molaOdasindaMiyim()) {
    ilerle();
    yuru();
  }
}
// --- buradan aşağısı main() içine ---
yuru();
```

1. ipucu: Bir komut kendi içinde kendini çağırabilir. Ama bir yerde durması gerekir, yoksa hiç bitmez.

2. ipucu: `void yuru()` yaz: mola odasında değilsen bir ilerle ve `yuru();` diye kendini çağır. Mola odasındaysan hiçbir şey yapma, iş kendiliğinden biter.

Vardiya notu: Komut kendini çağırdı ve yine de bitti. Özyinelemede zor olan başlamak değil, durmayı hatırlamaktır.

## 31 — Büyüyen Spiral

**Vardiya 6 · döngü değişkenini parametre olarak vermek**

Görev: Bir adım, iki adım, üç adım. Her kenar bir öncekinden uzun. Aynı komutu her turda farklı bir sayıyla çağır.

Hedef 6 satır · bu çözüm 6 satır · çikolata 0 · 25 adım

```cpp
void ilerleN(int n) {
  for (int i = 0; i < n; i++) {
    ilerle();
  }
}
// --- buradan aşağısı main() içine ---
for (int i = 1; i <= 3; i++) {
  ilerleN(i);
  sagaDon();
}
```

1. ipucu: Döngünün sayacı sadece kaç kere döneceğini belirlemez; onu bir değer olarak da kullanabilirsin.

2. ipucu: `void ilerleN(int n)` yaz, sonra `for (int i = 1; i <= 3; i++)` döngüsünün içinde `ilerleN(i);` ve `sagaDon();` çağır. Her turda i büyüdükçe kenar da uzar.

Vardiya notu: Altı satır, büyüyen bir spiral. Döngü ile fonksiyon birleşince ortaya desen çıkıyor.

## 32 — Vardiya Amiri

**Vardiya 6 · öğrendiğin her şey**

Görev: Fabrikanın en büyük deposu, yedi çikolata ve tek bir çıkış. Yolu ezberleyemezsin, ezberlemene de gerek yok. Öğrendiğin kuralı yaz ve arkana yaslan.

Hedef 7 satır · bu çözüm 7 satır · çikolata 7 · 254 adım

```cpp
while (!molaOdasindaMiyim()) {
  if (ustumdeCikolataVar()) {
    kap();
  } else if (onumdePaletVar()) {
    sagaDon();
  } else {
    ilerle();
  }
}
```

1. ipucu: Bu harita öncekilerden büyük ama kural değişmedi. Her karede üç ihtimal var, üçü için de ne yapacağını söylemen yeterli.

2. ipucu: Çikolata varsa kap, önünde palet varsa sağa dön, ikisi de yoksa ilerle. Yedi satır, on bir kare genişliğinde bir labirent.

Vardiya notu: Vardiya bitti, depo boş, amir hâlâ ofiste. Sezer paydos kartını bastı ve cebi çikolata dolu.
