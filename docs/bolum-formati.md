# Bölüm Yazma Formatı

Bu belge bölümlerin nasıl yazılacağını anlatır. Bölüm yazmak için React, TypeScript ya da oyunun motoru hakkında hiçbir şey bilmeye gerek yok. Düz metin yazılıyor, gerisini dönüştürücü hallediyor.

Her bölüm `src/levels/bolumler/` altında kendi dosyasında: `01.md`, `02.md`, ... `16.md`.

---

## 1. Dosya iskeleti

Bir bölüm dosyası tam olarak şu bölümlerden oluşur, bu sırayla. Başlık adları birebir böyle yazılmalı.

```
# 1 — Kıpırda Bakalım

vardiya: 1
kavram: ilerle() ve noktalı virgül
izinliKomutlar: ilerle
izinliYapilar: -
hedefSatir: 2

## Harita
#####
#S.M#
#####

## Yon
dogu

## Gorev
Sezer üretim bandının başında duruyor. Onu mola odasına götür.

## Ipucu1
Sezer'i hareket ettiren tek bir komut var. Sağdaki listeye bak.

## Ipucu2
Alt alta iki kere `ilerle();` yaz. Satır sonundaki noktalı virgülü unutma.

## Cozum
ilerle();
ilerle();

## VardiyaNotu
Vardiya başladı. Sezer henüz hiçbir şey kapmadı. Henüz.
```

---

## 2. Alanların anlamı

### Başlık satırı

`# <numara> — <bölüm adı>`

Bölüm adı kısa ve akılda kalıcı olsun. "Döngü Alıştırması 3" değil, "Upuzun Koridor".

### `vardiya`

1, 2, 3 veya 4. Bölüm 1-4 birinci vardiya, 5-8 ikinci, 9-12 üçüncü, 13-16 dördüncü.

### `kavram`

Bu bölümün öğrettiği **tek** yeni şey. Tek satır. Örnek: `for döngüsü`, `if / else`, `int ile değişken`.

Bir bölümde iki yeni kavram varsa o bölüm ikiye bölünmeli.

### `izinliKomutlar`

Bu bölümde kullanılmasına izin verilen oyun komutları, virgülle ayrılmış, parantezsiz.

```
izinliKomutlar: ilerle, sagaDon, kap
```

Kural: **bir komut, açıldığı bölümden itibaren hep izinli kalır.** Bölüm 4'te `kap` açıldıysa 5 ve sonrasında da listede olmalı.

### `izinliYapilar`

Bu bölümde kullanılmasına izin verilen C++ yapıları. Yoksa `-` yaz.

Kullanılabilecek değerler: `for`, `while`, `if`, `else`, `degisken`, `fonksiyon`.

`for (int i = 0; ...)` başlığındaki tanım döngünün parçası sayılıyor: sırf onun için `degisken` yazmana gerek yok. `degisken` sadece gövdede kendi başına `int sayac = 0;` yazılan bölümlerde gerekiyor.

```
izinliYapilar: for, if
```

Komutlarda olduğu gibi, bir yapı açıldığı bölümden itibaren hep izinli kalır.

Öğrenci izinli olmayan bir şey kullanırsa oyun uyarıyor. Bu ceza değil, yönlendirme: öğrenciyi o bölümün öğrettiği yola sokmak için var. Bölüm 5'te `for` izinli olmadığı için öğrenci 12 kere `ilerle();` yazmak zorunda kalıyor — bütün numara bu.

### `hedefSatir`

Üçüncü yıldız için gereken en fazla satır sayısı. **Referans çözümün satır sayısına eşit yaz.**

Sayılmayanlar: kilitli iskelet (`#include`, `int main()`, `return 0;`), boş satırlar, ve sadece `{` veya `}` içeren satırlar. Öğrenci parantez saymakla değil, algoritmayla uğraşıyor.

En sık karışan yer burası, o yüzden örnekleyelim. Şu çözüm **2 satır** sayılır, 3 değil:

```cpp
for (int i = 0; i < 12; i++) {   // 1
  ilerle();                      // 2
}                                // sayılmaz, tek başına parantez
```

Emin olamadığında `npm run bolum:gelen` sana kaç çıktığını söylüyor.

Bölüm 5 istisna: orada hedef satırı bilerek düşük tutuyoruz (örneğin `3`), böylece öğrenci 12 satır yazıp üçüncü yıldızı alamıyor ve bir sonraki bölümde döngüyü öğrenince geri dönüp alıyor.

### `## Harita`

Izgaranın kendisi. Semboller:

| Sembol | Anlamı |
|---|---|
| `#` | Palet. Geçilmez. |
| `.` | Boş zemin. Geçilebilir. |
| `S` | Sezer'in başlangıç konumu. Tam olarak 1 tane. |
| `C` | Çikolata. 0 veya daha fazla. |
| `M` | Mola odası, yani hedef. Tam olarak 1 tane. |

Kurallar:

- Bütün satırlar aynı uzunlukta olmalı.
- Haritanın dört kenarı `#` ile kapalı olmalı. Sezer'in dışarı çıkması bir hata mesajı, bir bölüm tasarımı değil.
- En küçük harita 3x3, en büyük 16x16. Daha büyüğü ekrana sığmıyor.
- `S` ve `M` aynı karede olamaz.
- `C` bir paletin üstüne konulamaz.

### `## Yon`

Sezer'in başlangıçta baktığı yön. Sadece şu dördünden biri: `kuzey`, `dogu`, `guney`, `bati`.

Haritada `kuzey` yukarı, `guney` aşağı, `dogu` sağa, `bati` soladır.

### `## Gorev`

Öğrenciye görünen görev metni. 1-2 cümle. Ne yapması gerektiğini söyler, **nasıl yapacağını söylemez.**

İyi: *"Depo koridorunun sonunda bir çikolata var. Kap ve mola odasına git."*
Kötü: *"`for` döngüsü kullanarak 8 kez ilerle."*

### `## Ipucu1`

Nazik itme. Doğru yöne bakmasını sağlar, cevabı vermez.

*"Aynı komutu 12 kere yazmak zorunda mısın? Sağdaki listenin altına bak."*

### `## Ipucu2`

Neredeyse cevap. Öğrenci burada takılıyorsa bölümü geçebilmeli, çünkü takılıp bırakan öğrenci hiçbir şey öğrenmiyor.

*"`for (int i = 0; i < 12; i++) { }` yaz, süslü parantezin içine `ilerle();` koy."*

### `## Cozum`

Bölümü gerçekten geçen C++ kodu. **Sadece gövde yazılıyor** — `#include`, `int main()` ve `return 0;` iskeletten geliyor, buraya yazılmıyor.

Bu alan öğrenciye hiç gösterilmiyor. Otomatik doğrulayıcı bunu kullanarak bölümün çözülebilir olduğunu kanıtlıyor. **Boş bırakılmış veya çalışmayan bir çözüm, bölümü doğrudan geçersiz kılar.**

Çözüm sadece `izinliKomutlar` ve `izinliYapilar` içindekileri kullanmalı, ve `hedefSatir` kadar veya daha az satır olmalı.

15. bölümden itibaren fonksiyon tanımı da yazılabiliyor. O zaman çözüm şöyle görünüyor — `--- main ---` ayıracı, fonksiyon bölmesiyle gövdeyi ayırıyor:

```
void koseDon() {
    sagaDon();
    ilerle();
}
--- main ---
koseDon();
koseDon();
```

### `## VardiyaNotu`

Bölüm geçildiğinde çıkan tek satırlık mizah. Oyunun karakterini bu satırlar taşıyor, ciddi olmasına gerek yok.

*"Sezer 3 çikolata kaptı. Amir fark etmedi."*
*"Vardiya 7 tamamlandı. Cebe sığmayan çikolata sayısı: 2."*

---

## 3. Motorun tanıdığı C++

Çözüm yazarken bunların dışına çıkma. Yorumlayıcı bütün C++'ı değil, öğretmemiz gereken kadarını tanıyor:

| Kategori | Destekleniyor |
|---|---|
| Tipler | `int`, `bool` |
| Değişken | `int sayac = 0;`, `sayac = sayac + 1;`, `sayac++`, `sayac += 2` |
| Döngü | `for (int i = 0; i < 10; i++) { }`, `while (kosul) { }` |
| Koşul | `if (kosul) { }`, `else { }`, `else if` |
| Fonksiyon | `void isim() { }` ve çağrısı |
| Operatörler | `+ - * / %`, `< > <= >= == !=`, `&& \|\| !` |
| Sabitler | tam sayılar, `true`, `false` |

Yok: pointer, dizi, sınıf, `string`, `cout`, `cin`, `#include` (iskelette zaten var).

---

## 4. Bölüm tasarım kuralları

Bunlar formatın değil, iyi bölümün kuralları. Asıl iş burada.

**Tek yeni fikir.** Her bölüm bir şey öğretir ve bir öncekini tekrar ettirir. İki yeni şey varsa bölümü ikiye böl.

**Yeni kavram zorunlu olmalı, süs olmamalı.** Bölüm `for` öğretiyorsa, `for` kullanmadan üçüncü yıldızı almak imkânsız olmalı. Aksi halde öğrenci eski yöntemle geçip yeni kavramı hiç öğrenmiyor.

**Harita mümkün olduğunca küçük.** Büyük harita zorluk değil, gürültü. Bir kavramı 5x5'te öğretebiliyorsan 10x10 yapma.

**Bölüm 5 bilerek sıkıcı.** Öğrenci 12 kere `ilerle();` yazacak ve bundan sıkılacak. Bu acı kasıtlı; yumuşatma, kısaltma. Bölüm 6'da aynı koridoru `for` ile 3 satırda geçince döngünün ne işe yaradığını kimse anlatmadan anlayacak. Projenin tek pedagojik numarası bu.

**Zorluk düz artmalı.** Bir bölümü çözmesi öncekinden biraz daha zor olsun, iki kat değil.

**Sıfırdan gelen biri gözüyle oku.** `for` kelimesini hiç duymamış birine bu görev metni ve bu iki ipucu yetiyor mu? Yetmiyorsa ipuçlarını düzelt, bölümü kolaylaştırma.

---

## 5. Bir bölümü bitirmeden önceki kontrol listesi

- [ ] Harita dikdörtgen, bütün satırlar aynı uzunlukta
- [ ] Dört kenar `#` ile kapalı
- [ ] Tam 1 tane `S`, tam 1 tane `M` var
- [ ] `Yon` dört değerden biri
- [ ] `Cozum` gerçekten bölümü geçiyor
- [ ] `Cozum` sadece `izinliKomutlar` ve `izinliYapilar` içindekileri kullanıyor
- [ ] `Cozum` içinde `#include`, `int main()` veya `return 0;` yok
- [ ] Her komut satırının sonunda noktalı virgül var
- [ ] `hedefSatir`, `Cozum`un satır sayısına eşit (süslü parantez satırları sayılmadan)
- [ ] `izinliKomutlar` ve `izinliYapilar` önceki bölümlerde açılanları da içeriyor
- [ ] Görev metni ne yapılacağını söylüyor, nasıl yapılacağını söylemiyor
- [ ] `Ipucu2` gerçekten kurtarıcı
- [ ] `VardiyaNotu` var ve komik olmaya çalışıyor

---

## 6. Bunları yapay zekâya yazdırırken

Bölümleri yapay zekâya yazdırmak serbest, ama iki şart var:

**Bu dosyanın tamamını ve `docs/tasarim.md`'yi ona ver.** Formatı, komut listesini ve motorun tanıdığı C++ alt kümesini bilmeden yazdığı bölüm işe yaramıyor.

**Ürettiği her bölümü kendin oyna.** Yapay zekânın en sık yaptığı hata, haritada gerçekte çözülemeyen ya da tesadüfen boş kodla geçilen bölüm üretmek. Haritayı kâğıda çiz ve çözümü elle takip et: Sezer nereden başlıyor, hangi yöne bakıyor, komutlar onu nereye götürüyor, mola odasına varıyor mu, bütün çikolataları topluyor mu.

## 7. Doğrulayıcılar

| Komut | Ne denetler |
|---|---|
| `npm run bolum:gelen` | `docs/bolumler/` altındaki taslakları. Sonucu `docs/gelen-bolum-raporu.md` dosyasına tablo halinde yazar: hangi bölüm hazır, hangisinde ne yanlış. |
| `npm run bolum:dogrula` | Oyunda yayında olan bölümleri (`src/levels/bolumler/`). Bunun kırmızı olması oyunun bozulduğu anlamına gelir. |
| `npm test` | Motor dahil her şey. Taslakları denetlemez. |

Taslağını yazdıktan sonra `npm run bolum:gelen` çalıştır, raporu oku, düzelt, tekrar çalıştır. Hazır olan bölüm `src/levels/bolumler/` altına taşınır ve oyuna girer.

Yapay zekânın ürettiğini de kâğıtta kontrol et: doğrulayıcı bölümün çözülebildiğini söylüyor, öğrettiğini söylemiyor.
