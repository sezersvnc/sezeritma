# Başlangıç

Bu dosya projeye yeni bakan birinin nereden başlayacağını anlatır.

## Proje ne

**Sezeritma**, tarayıcıda çalışan, C++ ile algoritma öğreten bir oyun. Hedef kitle: bilgisayar mühendisliğine yeni başlamış, kod yazmamış 1. sınıf öğrencileri.

Oyunda çikolata fabrikasında stajyer olan Sezer var. Öğrenci gerçek C++ kodu yazarak onu yönetiyor: paletlerin arasından geçiyor, raflardaki çikolataları kapıyor, vardiya bitmeden mola odasına ulaşıyor. 16 bölüm, her biri bir programlama kavramı.

Adı Sezer + algoritma.

Detayların tamamı [tasarim.md](tasarim.md) dosyasında. Başlamadan önce bir kere baştan sona okumak 10 dakika sürüyor ve sonraki her şeyi kolaylaştırıyor.

## Neden C++, ve tören yükünü nasıl çözüyoruz

BM birinci sınıfta C/C++ okutuluyor. Öğrenci burada öğrendiğini ertesi gün dersinde kullanıyor — oyun eğlence olmaktan çıkıp ders yardımcısı oluyor.

Ama C++'ın bir problemi var: `#include`, `int main()`, `return 0;`, noktalı virgüller. Bunların hiçbiri algoritma değil, ve yeni başlayan bunlarla boğuşurken döngüyü öğrenemiyor.

Çözüm: editör boş sayfa göstermiyor. Kilitli bir iskelet ve içinde öğrencinin alanı var.

```cpp
#include "sezeritma.h"     // kilitli, gri

int main() {               // kilitli
    ilerle();              // öğrencinin alanı
    ilerle();
    return 0;              // kilitli
}
```

Öğrenci töreni görüyor ama yazmak zorunda kalmıyor. 15. bölümde `main()`'in üstünde ikinci bir düzenlenebilir bölme açılıyor ve fonksiyon kavramı orada öğretiliyor.

Bir de şu var: derleyiciyi kendimiz yazdığımız için hata mesajlarını da biz yazıyoruz. Gerçek bir derleyici eksik noktalı virgül için okunamaz bir yığın döküyor; biz *"3. satırın sonunda noktalı virgül eksik"* diyoruz. Projenin en güçlü tarafı bu.

## Nasıl bölüştük

| | Klasör | İçerik |
|---|---|---|
| **Sedat** | `core/`, `components/sahne/`, `components/editor/`, `store/` | Sözcük ayırıcı, ayrıştırıcı, yürütücü, simülasyon, ızgara animasyonu, kod editörü, testler, yayın |
| **Sezer** | `levels/`, `content/`, `components/panel/` | 16 bölümün tasarımı, müfredat sırası, bütün Türkçe metinler, arayüzün panel tarafı |

Ayrım klasör bazlı: kimse başkasının klasörüne dokunmuyor, dolayısıyla ikimiz aynı anda push edebiliyoruz ve çakışma çıkmıyor.

Bölümler ve metinler oyunun öğretme gücünün kendisi. Kötü kurulmuş bir bölüm sırası, kusursuz bir motorla bile öğretmiyor — o yüzden iki taraf da kritik yolda, ve ikisi de birbirini beklemiyor.

Bağlantı noktamız tek: [bolum-formati.md](bolum-formati.md). Bölümler düz metin olarak yazılıyor, motor onu koda çeviriyor. Yani bölüm yazmak için motorun içi hakkında hiçbir şey bilmek gerekmiyor.

## Oyunun komut listesi

Oyunda sadece bunlar var, başkası yok:

| Komut | Dönüş tipi | Ne yapar |
|---|---|---|
| `ilerle();` | `void` | Baktığı yöne 1 kare gider |
| `sagaDon();` | `void` | Yerinde sağa döner, ilerlemez |
| `solaDon();` | `void` | Yerinde sola döner, ilerlemez |
| `kap();` | `void` | Bastığı karedeki çikolatayı alır |
| `molaOdasindaMiyim()` | `bool` | Mola odasındaysa `true` |
| `onumdePaletVar()` | `bool` | Önünde palet varsa `true` |
| `ustumdeCikolataVar()` | `bool` | Bastığı karede çikolata varsa `true` |

Bunların yanında öğrenci C++'ın öğrettiğimiz kısmını kullanabiliyor: `int`, `bool`, `for`, `while`, `if`, `else`, `void isim() { }`.

Yok: pointer, dizi, sınıf, `string`, `cout`, `cin`.

## Bölüm tarafında sıradaki iş

Bölümler `docs/bolumler/` altında, her biri kendi dosyasında: `01.md`, `02.md`, ... `16.md`.

`01.md` hazır ve doğru yazılmış — yazılacak her bölüm birebir o iskelette olacak. Sıradaki paket **2'den 8'e kadar**:

| # | Bölüm | Öğrettiği |
|---|---|---|
| 2 | Üç Adım Ötede | Komutlar yazıldığı sırayla çalışır |
| 3 | Koridoru Dön | `sagaDon(); solaDon();` — dönmek ilerlemek değildir |
| 4 | İlk Çikolata | `kap();` |
| 5 | Upuzun Koridor | Bilerek sıkıcı: 12 kere `ilerle();` |
| 6 | Aynı Koridor, Tek Satır | `for (int i = 0; i < 12; i++)` |
| 7 | Aralıklı Raflar | Süslü parantezin içine birden fazla komut |
| 8 | Bütün Depoyu Tara | İç içe `for` |

Sonraki paket 9-16, müfredat tablosu [tasarim.md](tasarim.md)'de.

### Yazdıktan sonra kâğıtta oyna

Oyun henüz çalışmıyor, doğrulama şimdilik elle. Haritayı çiz, çözümdeki komutları tek tek uygula, Sezer'in nereye gittiğini takip et: mola odasına varıyor mu, bütün çikolataları topluyor mu, palete çarpıyor mu?

Bu adım atlanabilir gibi duruyor ama atlanamıyor. Çözülemeyen bir bölüm, tek günlük bir projede en pahalı hata — ve hep en kötü anda, akşam ortaya çıkıyor.

Motor hazır olunca `npm run bolum:dogrula` bunu otomatik yapacak.

### Push

```
git add docs/bolumler
git commit -m "bolum 2-8 eklendi"
git push
```

## Kod tarafında sıradaki iş

Arayüzün panel tarafı `src/components/panel/` altında ve tamamı Sezer'in. Altı bileşen var; hepsi **saf sunum bileşeni**: props alır, JSX döndürür, hiçbir yere yazmaz, hiçbir global durumu okumaz. Bu kural sayesinde motorun ne yaptığını bilmeye gerek kalmıyor ve bileşenler tek başına geliştirilebiliyor.

| Bileşen | Ne gösterir |
|---|---|
| `UstBar` | Oyunun adı, kaçıncı bölümdeyiz, toplam yıldız, ilerleme çubuğu |
| `GorevKarti` | Bölüm numarası, adı, öğrettiği kavram, görev metni |
| `KomutListesi` | O bölümde izinli komutlar, dönüş tipleri ve ne yaptıkları |
| `IpucuPaneli` | İki kademeli ipucu. Önce sadece buton; basılınca 1. ipucu, tekrar basılınca 2. ipucu açılır |
| `VardiyaSonu` | Bölüm geçilince çıkan ekran: kaç yıldız, kaç satır kullandı, vardiya notu, "sonraki bölüm" ve "tekrar dene" butonları |
| `BolumHaritasi` | 16 bölüm, 4 vardiya halinde. Hangisi kilitli, hangisi açık, her birinden kaç yıldız alınmış |

Props tipleri `src/core/types.ts` içinde tanımlı olacak; o dosya yazıldıktan sonra bileşenleri yazmak için başka bir şey beklemeye gerek yok. Tasarım yönü [tasarim.md](tasarim.md)'deki "Görsel yön" başlığında: fabrika estetiği, beton grisi, sarı güvenlik şeridi, turuncu vurgu.

`VardiyaSonu` ve `BolumHaritasi` öncelikli — ikisi de oyunun "bir bölüm daha" hissini taşıyor, ve ikisi de motordan tamamen bağımsız çalışabiliyor.

## İki kritik kural

**Bir bölüm, tek yeni fikir.** Bölüm 3 hem dönmeyi hem toplamayı öğretiyorsa yanlış kurulmuş; ikiye bölünmeli.

**Bölüm 5 bilerek acı verecek.** Öğrenci orada 12 kere `ilerle();` yazacak ve sıkılacak. Sonra bölüm 6'da aynı koridoru `for` ile 3 satırda geçecek. O anda döngünün ne işe yaradığını kimse ona anlatmadan anlayacak. Bu acı yumuşatılmayacak, kısaltılmayacak, kolaylaştırılmayacak — oyunun tek pedagojik numarası bu.

## Yapay zekâ kullanırken

Serbest, ama iki şart var:

1. **[tasarim.md](tasarim.md) ve [bolum-formati.md](bolum-formati.md) dosyalarının tamamını ver.** Komut listesini, formatı ve motorun tanıdığı C++ alt kümesini bilmeden ürettiği bölüm işe yaramıyor.
2. **Ürettiği her bölümü kâğıtta oyna.** En sık yaptığı hata, gerçekte çözülemeyen ya da tesadüfen boş kodla geçilen bölüm üretmek.

## Karar veremediğin bir şey olursa

Sormak için bekleme, iki alternatifi de yaz, sonra birlikte seçelim. Beklemek en pahalı seçenek.
