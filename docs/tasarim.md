# Sezeritma — Tasarım Belgesi

Bu belge projenin tek referans kaynağı. Bir şey burada yazmıyorsa kararlaştırılmamıştır; burada yazanla çelişen bir şey yapılacaksa önce bu belge güncellenir.

---

## 1. Ürün

**Tek cümlede:** Bilgisayar mühendisliğine yeni başlamış bir öğrenci, çikolata fabrikasında vardiyadaki stajyer Sezer'i **gerçek C++ kodu yazarak** yönetir; paletlerin arasından geçip çikolataları kapar, vardiya bitmeden mola odasına ulaşır ve 16 bölümde döngü, koşul, değişken, fonksiyon kavramlarını kodunun satır satır çalıştığını görerek öğrenir.

**Hedef kitle:** 1. sınıf, Türkçe konuşan, kod yazmamış ya da yeni başlamış öğrenci.

**Başarı ölçütü:** Kimseye soru sormadan 1. bölümü 60 saniyede geçer ve 8. bölüme kadar tek başına ilerler.

### Neden C++

Bilgisayar mühendisliği birinci sınıfta C/C++ okutuluyor. Öğrenci burada öğrendiğini ertesi gün dersinde kullanıyor — oyun eğlence olmaktan çıkıp ders yardımcısı oluyor. Python daha kolay olurdu ama derse bağlanmazdı.

### C++'ın tören yükünü nasıl çözüyoruz

C++'ın gerçek problemi şu: `#include`, `int main()`, `return 0;`, noktalı virgüller, süslü parantezler. Bunların hiçbiri algoritma değil, ve yeni başlayan bunlarla boğuşurken döngüyü öğrenemiyor.

Çözüm: **editör boş sayfa göstermiyor.** Kilitli bir iskelet ve içinde düzenlenebilir bir gövde var.

```cpp
#include "sezeritma.h"        // kilitli, gri, değiştirilemez

int main() {                // kilitli
    ilerle();               // öğrencinin alanı
    ilerle();
    return 0;               // kilitli
}
```

Öğrenci töreni görüyor — dersinde karşısına çıktığında yabancı gelmeyecek — ama onu yazmak zorunda kalmıyor. 15. bölümde `main()`'in üstünde ikinci bir düzenlenebilir bölme açılıyor:

```cpp
#include "sezeritma.h"

void koseDon() {            // ikinci bölme, 15. bölümde açılıyor
    sagaDon();
    ilerle();
}

int main() {
    koseDon();
    return 0;
}
```

Fonksiyon kavramı, iskeletin genişlemesiyle öğretiliyor. Öğrenci hiçbir zaman boş bir dosyaya bakmıyor.

### Hikâye çerçevesi

Sezer stajyer. Depoda vardiyası var. Vardiya amiri her an dönebilir. Yapması gereken: paletlerin arasından geçip raftaki çikolataları toplamak ve mola odasına varmak — ve bunu ne kadar az satır kodla yaparsa o kadar iyi, çünkü vardiya kısa.

Bu çerçeve iki işe yarıyor. Birincisi "az satırla çöz" hedefi hikâyeden doğuyor, uydurma bir kural gibi durmuyor. İkincisi her bölüm sonunda tek satırlık mizah kancası açıyor: *"Sezer 3 çikolata kaptı. Amir fark etmedi. Vardiya 1 tamamlandı."*

Oyunun içindeki fabrikanın adı **Neşteli Çikolata Fabrikası**. Gerçek marka adı ve logosu kullanılmıyor.

---

## 2. Komut API'si

Projenin sözlüğü bu. Kodda, bölümlerde ve metinlerde bire bir bunlar kullanılır. Bu listenin dışında komut yok.

| Komut | Dönüş tipi | Ne yapar | Açıldığı bölüm |
|---|---|---|---|
| `ilerle();` | `void` | Baktığı yöne 1 kare gider | 1 |
| `sagaDon();` | `void` | Yerinde sağa döner, ilerlemez | 3 |
| `solaDon();` | `void` | Yerinde sola döner, ilerlemez | 3 |
| `kap();` | `void` | Bastığı karedeki çikolatayı alır | 4 |
| `molaOdasindaMiyim()` | `bool` | Mola odasındaysa `true` | 9 |
| `onumdePaletVar()` | `bool` | Önünde palet varsa `true` | 10 |
| `ustumdeCikolataVar()` | `bool` | Bastığı karede çikolata varsa `true` | 11 |

Bunlar `sezeritma.h` başlık dosyasından geliyormuş gibi sunuluyor. Öğrenci açısından tutarlı bir C++ dünyası; gerçekte motorun kendisi.

### Desteklenen C++ alt kümesi

Yorumlayıcı bütün C++'ı değil, öğretmemiz gereken kadarını tanıyor:

| Kategori | Destekleniyor |
|---|---|
| Tipler | `int`, `bool` |
| Değişken | `int sayac = 0;`, `sayac = sayac + 1;`, `sayac++`, `sayac += 2` |
| Döngü | `for (int i = 0; i < 10; i++) { }`, `while (kosul) { }` |
| Koşul | `if (kosul) { }`, `else { }`, `else if` |
| Fonksiyon | `void isim() { }` ve çağrısı |
| Operatörler | `+ - * / %`, `< > <= >= == !=`, `&& \|\| !` |
| Sabitler | tam sayılar, `true`, `false` |

Desteklenmeyen her şey (pointer, sınıf, dizi, `cout`, `string`) öğrenciye anlaşılır bir mesajla söyleniyor: *"Bu oyunda `cout` yok. Sezer'i komutlarla yönetiyorsun."*

### Izgara elemanları

| Sembol | Eleman | Davranış |
|---|---|---|
| `S` | Sezer | Başlangıç konumu. Her haritada tam olarak bir tane. |
| `C` | Çikolata | Toplanabilir. Sıfır veya daha fazla. |
| `M` | Mola odası | Hedef. Her haritada tam olarak bir tane. |
| `#` | Palet | Geçilmez. |
| `.` | Zemin | Boş, geçilebilir. |

---

## 3. Müfredat

16 bölüm, 4 vardiya. Her bölüm **tek bir yeni fikir** öğretir ve bir öncekini tekrar ettirir.

### Vardiya 1 — Üretim Hattı

*Bilgisayar komutları yazdığın sırayla çalıştırır.*

| # | Bölüm | Yeni kavram | Öğrenci ne yapar |
|---|---|---|---|
| 1 | Kıpırda Bakalım | `ilerle();` ve noktalı virgül | Tek komut yazar, Sezer 1 kare gider |
| 2 | Üç Adım Ötede | sıralı çalışma | 3 komut alt alta, sırayla işlendiğini görür |
| 3 | Koridoru Dön | `sagaDon(); solaDon();` | Dönmenin ilerlemek olmadığını öğrenir |
| 4 | İlk Çikolata | `kap();` | Çikolatanın üstüne gidip kapar |

### Vardiya 2 — İstif Deposu

*Aynı işi tekrar tekrar yazmak yerine döngü kur.*

| # | Bölüm | Yeni kavram | Öğrenci ne yapar |
|---|---|---|---|
| 5 | Upuzun Koridor | *(bilerek acı)* | 12 kez `ilerle();` yazar, üçüncü yıldızı alamaz, sıkılır |
| 6 | Aynı Koridor, Tek Satır | `for` | `for (int i = 0; i < 12; i++)` ile 3 satırda çözer |
| 7 | Aralıklı Raflar | döngü gövdesi | Süslü parantezin içine birden fazla komut koyar |
| 8 | Bütün Depoyu Tara | iç içe `for` | 4x4 depoyu satır satır gezer |

### Vardiya 3 — Sevkiyat Bölgesi

*Ne olacağını önceden bilmiyorsan karar vermen gerekir.*

| # | Bölüm | Yeni kavram | Öğrenci ne yapar |
|---|---|---|---|
| 9 | Koridorun Sonu Nerede? | `while`, `bool` | `while (!molaOdasindaMiyim())` |
| 10 | Palet Var mı? | `if`, `onumdePaletVar()` | Çarpmadan önce kontrol eder |
| 11 | Rafta Ne Var? | `if / else` | `ustumdeCikolataVar()` ile karar ağacı kurar |
| 12 | Sevkiyat Labirenti | `while` + `if` | Sağ duvar takibiyle labirenti çözer |

### Vardiya 4 — Gece Vardiyası

*Bir şeyi hatırlaman ve kendi komutunu yazman gerekir.*

| # | Bölüm | Yeni kavram | Öğrenci ne yapar |
|---|---|---|---|
| 13 | Kaç Tane Kaptım? | `int`, `sayac++` | Değişken izleyici burada açılır, sayacın aktığını izler |
| 14 | Ya Duvar Ya Mola | `&&` ile iki koşul | `while (!molaOdasindaMiyim() && !onumdePaletVar())` |
| 15 | Kendi Kısayolum | `void isim() { }` | İkinci editör bölmesi açılır, kendi fonksiyonunu yazar |
| 16 | Büyük Çikolata Soygunu | sentez | Bütün komutlar serbest; üçüncü yıldız için fonksiyon şart |

### Bonus havuzu

Motorda ek iş gerektirmeyen, vakit kalırsa eklenecek bölümler: parametreli fonksiyon `void ilerleN(int n)`, dizi ve `for` ile gezinme, lineer arama, "en az satırla çöz" meydan okumaları, hareketli vardiya amirinden kaçma.

### Yıldız sistemi

| Yıldız | Koşul |
|---|---|
| 1 | Bölümü çözdü |
| 2 | İpucu kullanmadan çözdü |
| 3 | Hedef satır sayısının altında veya eşitinde çözdü |

Satır sayılırken kilitli iskelet, boş satırlar ve sadece `{` veya `}` içeren satırlar sayılmıyor. Öğrenci parantez saymakla değil, algoritmayla uğraşıyor.

Üçüncü yıldız verimliliği ödüllendiriyor ve her bölümde ulaşılabilir. 5. bölümde 12 satır yazan öğrenci üç yıldızını alıyor, ama 6. bölümde aynı koridoru 2 satırda geçince döngünün ne işe yaradığını kimse anlatmadan kavrıyor. Ders, ceza vermekten değil karşılaştırmadan doğuyor.

---

## 4. Görsel yön

Fabrika estetiği, oyuncak değil.

- **Zemin:** soğuk beton grisi, üstünde sarı güvenlik şeridi çizgileri. Bu çizgiler zaten ızgaranın kendisi — dekor ve fonksiyon aynı şey.
- **Palet:** ahşap kahverengi ve mavi plastik, iki varyant.
- **Çikolata:** sıcak kırmızı-kahve folyo, hafif parlama.
- **Sezer:** turuncu reflektif yelek, baret. Ekrandaki en parlak turuncu; göz her zaman onu bulur.
- **İz:** geçtiği kareler soluk turuncu iz bırakır, "nereye gitti" tek bakışta görünür.
- **Kilitli iskelet:** editörde soluk gri, seçilebilir ama düzenlenemez. Öğrencinin alanı normal parlaklıkta.
- **Tipografi:** sıkışık endüstriyel başlık, okunaklı gövde, kodda tek aralıklı yazı tipi.
- **Düzen:** solda aydınlık fabrika, sağda koyu kod paneli. İki dünya net ayrılır.

---

## 5. Teknik mimari

### Yığın

| Katman | Seçim | Gerekçe |
|---|---|---|
| Build | Vite | Anında yenileme, sıfır konfigürasyon |
| Dil | TypeScript (strict) | Tip tanımları iki kişi arasındaki sözleşme görevi görüyor |
| UI | React | Bölüm, durum ve animasyon üçlüsü bildirimsel olunca daha hızlı |
| Stil | Tailwind | İki kişi CSS dosyasında çakışmıyor |
| Durum | Zustand | Redux ağır, Context gereksiz yeniden çizim yapıyor |
| Editör | CodeMirror | C++ renklendirme, satır numarası, aktif satır vurgusu, salt okunur bölgeler |
| Yorumlayıcı | Kendi yazdığımız | Aşağıda |
| Test | Vitest | Motor saf fonksiyon olduğu için test bedava |
| Yayın | Netlify | Her push otomatik yayına gidiyor |

Eklenmeyecekler: Next.js, Redux, GraphQL, herhangi bir backend, herhangi bir veritabanı, WebAssembly ile gerçek derleyici.

### Neden gerçek bir C++ derleyicisi kullanmıyoruz

Tarayıcıda C++ derlemek mümkün (WebAssembly'ye derlenmiş derleyicilerle), ama bize hiçbir faydası yok ve üç şeyi kaybettiriyoruz:

1. **Adım adım yürütme yok.** Derlenmiş kod ya çalışır ya çalışmaz; satır satır izlenemez.
2. **Hata mesajları öğrencinin düşmanı.** Gerçek bir derleyicinin eksik noktalı virgül için verdiği hata, yeni başlayan biri için okunamaz. Bizim vereceğimiz mesaj: *"3. satırın sonunda noktalı virgül eksik."*
3. **Ağırlık.** Onlarca megabaytlık derleyici, tek bölümlük bir oyun için.

Bu yüzden C++'ın öğretmemiz gereken alt kümesini kendimiz ayrıştırıp kendimiz yürütüyoruz.

### Kod çalıştırma — projenin kalbi

Dört aşama:

1. **Sözcüklere ayır.** Kod token'lara bölünür. Her token'ın satır ve sütun bilgisi tutulur.
2. **Ayrıştır.** Özyinelemeli inişli ayrıştırıcı token'lardan sözdizimi ağacı kurar. Sözdizimi hatası varsa burada, satır numarasıyla ve Türkçe yakalanır.
3. **Adım adım yürüt.** Ağacı kendi yürütücümüz tek tek adımlar. Her adımda hangi satırdayız, değişkenler ne durumda, Sezer nerede — hepsi elimizde.
4. **Oynat.** Adımlar arayüze akar; ızgara animasyonu, satır vurgusu ve değişken paneli aynı akıştan beslenir.

Bu tasarımın kazandırdıkları:

- **Aktif satır vurgusu.** Kod çalışırken editörde işlenen satır boyanıyor. Öğrenci `for` döngüsünün başa dönüşünü görüyor.
- **Değişken izleyici.** `int sayac = 0;` yazdığı an yan panelde `sayac: 0 → 1 → 2` akıyor.
- **Adım adım / yavaş / hızlı çalıştırma.** Hayatındaki ilk hata ayıklayıcıyı farkında olmadan kullanıyor.
- **Sonsuz döngü sayfayı kilitlemiyor.** Adım sayacı sınıra gelince "kodun hiç bitmedi" hatası veriliyor.
- **Türkçe, satır numaralı, yol gösterici hata mesajları.**

Bu maddelerin hiçbiri hazır bir derleyiciyle mümkün değil. Mimari kararın gerekçesi bu.

### Hata mesajları

Hata mesajı "HATA" demez. Ne olduğunu, nerede olduğunu ve ne denenebileceğini söyler. Üç grup var:

**Sözdizimi hataları** — yeni başlayanın bir numaralı düşmanı, ve bizim en güçlü tarafımız:

- *"3. satırın sonunda noktalı virgül eksik."*
- *"5. satırda açtığın süslü parantezi kapatmamışsın."*
- *"`ilerle` komutunu çağırmak için sonuna parantez koymalısın: `ilerle();`"*
- *"`iflerle` diye bir komut yok. `ilerle` mi demek istedin?"*

**Çalışma hataları:**

- *"4. satırda palete çarptın. `onumdePaletVar()` ile önce kontrol etmeyi dene."*
- *"Depodan çıktın. Sezer duvarların dışına gidemez."*
- *"Kodun hiç bitmedi, sonsuz döngüye girdin. `while` koşulun ne zaman yanlış olacak?"*
- *"Burada çikolata yok, `kap();` boşa gitti."*

**Bölüm hataları:**

- *"Mola odasına ulaştın ama depoda 2 çikolata kaldı."*
- *"Bu bölümde `while` henüz açılmadı. Elindeki komutlarla çözebilirsin."*

Bu metinlerin tamamı Sezer'in sorumluluğunda.

### Klasör yapısı ve sahiplikler

```
src/
  core/               -> Sedat.  Sözcük ayırıcı, ayrıştırıcı, yürütücü, simülatör,
                        hata sözlüğü, testler. React bilmez, saf TypeScript.
  components/sahne/   -> Sedat.  Izgara, Sezer, paletler, çikolatalar, animasyon.
  components/editor/  -> Sedat.  Kod editörü, kilitli iskelet, çalıştırma kontrolleri.
  store/              -> Sedat.  Oyun durumu.

  levels/bolumler/    -> Sezer.  Bölüm dosyaları: 01.md ... 16.md (düz metin).
  levels/             -> Sezer.  Bölüm okuyucu ve katalog.
  content/            -> Sezer.  Tüm Türkçe metinler: görevler, ipuçları,
                        hata sözlüğü, vardiya sonu mizah satırları.
  components/panel/   -> Sezer.  Görev kartı, komut listesi, ipucu paneli,
                        vardiya sonu ekranı, bölüm haritası, üst bar.
```

`components/panel/` altındaki bileşenler saf sunum bileşenleri: props alırlar, JSX döndürürler, hiçbir yere yazmazlar. Props tipleri `core/types.ts` içinde tanımlı olduğu için iki taraf birbirinin dosyasına hiç dokunmadan çalışıyor.

Kural: kimse başkasının klasörüne dokunmaz.

### Sözleşme

`src/core/types.ts` sözleşmedir. İlk iş olarak yazılır, sonra tek taraflı değiştirilmez. İçinde bir bölümün neye benzediği, motorun ne aldığı ve ne döndürdüğü, panel bileşenlerinin hangi props'ları beklediği tanımlıdır. Bu dosya yazıldığı an iki taraf birbirini beklemeden çalışabilir.

---

## 6. İş bölümü

| | Klasör | İçerik |
|---|---|---|
| **Sedat** | `core/`, `components/sahne/`, `components/editor/`, `store/` | Sözcük ayırıcı, ayrıştırıcı, yürütücü, simülasyon, animasyon, kod editörü, testler, yayın |
| **Sezer** | `levels/`, `content/`, `components/panel/` | 16 bölümün haritası ve verisi, referans çözümler, bütün Türkçe metinler, arayüzün panel tarafı |

Ayrım klasör bazlı, dolayısıyla ikisi aynı anda push edebiliyor ve çakışma çıkmıyor. İkisi de kritik yolda, ikisi de birbirini beklemiyor.

Bağlantı noktası tek: **bölüm formatı.** Sezer bölümleri düz metin haritası olarak yazıyor (bkz. `docs/bolum-formati.md`), Sedat bunu koda çeviren dönüştürücüyü ve doğrulayıcıyı yazıyor. Doğrulayıcı her bölümü referans çözümüyle otomatik oynatıp şunları söylüyor: çözülebiliyor mu, izinli komutları aşmış mı, hedef satır sayısı tutarlı mı, boş kodla geçiliyor mu.

Sezer motor kodunu hiç okumadan, saniyeler içinde geri bildirim alıyor.

---

## 7. Günün akışı

| Aşama | Sedat | Sezer |
|---|---|---|
| Kurulum | Repo, iskelet, `types.ts`, harita dönüştürücü, doğrulayıcı | Bölüm 1-8 haritaları ve metinleri |
| Öğleye kadar | Sözcük ayırıcı, ayrıştırıcı, yürütücü, testler | Bölüm 9-16 |
| İlk birleşme | Gerçek motor ve gerçek bölümler, 1. bölüm uçtan uca çalışıyor | Doğrulayıcıdan geçmeyen bölümleri düzeltir |
| Öğleden sonra | Izgara, editör, kilitli iskelet, satır vurgusu, değişken paneli | Panel bileşenleri, hata sözlüğü, vardiya sonu metinleri |
| Özellik dondurma | Yeni hiçbir şey eklenmez | Yeni hiçbir şey eklenmez |
| Akşam | İkisi birlikte 16 bölümü baştan sona oynar, sadece oynanabilirliği engelleyen hatalar düzeltilir | |
| Kapanış | Yayın, README, ekran kaydı | |

Özellik dondurma saati baştan kabul edilir. Tek günlük projede son saatte "bir de şunu ekleyelim" demek, çalışan bir ürünü bozmanın en hızlı yolu.

---

## 8. Bitti tanımı

**Bir bölüm bitti sayılır**, ancak şunların hepsi doğruysa: referans çözümüyle geçiyor, boş kodla geçilmiyor, yanlış çözümde anlamlı hata veriyor, iki kademeli ipucu var ve gerçekten yardım ediyor, izinli komutlar dışına çıkmıyor.

**Proje bitti sayılır**, ancak şunların hepsi doğruysa: 16 bölüm oynanabiliyor, sıfırdan gelen biri kimseye sormadan 1. bölümü geçiyor, yayındaki link çalışıyor, sayfa hiç çökmüyor, README dolu.

---

## 9. Riskler

| Risk | Erken uyarı | Plan B |
|---|---|---|
| Ayrıştırıcı yetişmiyor | Öğlen 1. bölüm hâlâ oynanmıyor | Alt kümeyi daralt: `for` ve `while` kalsın, fonksiyon tanımı çıksın, 14 bölümle yayınla |
| Bölüm metinleri yetişmiyor | Öğleden sonra | Kısa görev cümlesi ve tek ipucu bırak |
| Animasyon takılıyor | — | Animasyonu kapat, sonucu anlık göster |
| Vakit bitiyor | Akşam | Az bölümle kusursuz çalışan bir ürün, 16 bölümle bozuk bir üründen her zaman iyidir |

---

## 10. Kararlar

- Oyunun adı **Sezeritma**. Sezer + algoritma.
- Fabrika adı **Neşteli**. Gerçek marka adı kullanılmıyor.
- Bölümlerin en büyük ölçüsü 16x16. 5. bölümün "acısı" uzun bir koridor gerektirdiği için ilk yazdığımız 12x12 sınırı büyütüldü.
- Izgarada dış duvar halkası hücre olarak çizilmiyor; çerçevenin kendisi o duvar. Küçük haritalar böylece koridor gibi okunuyor.
- Yıldız merdiveni: çözdü (1) + ipucu kullanmadı (+1) + hedef satırın altında kaldı (+1).
