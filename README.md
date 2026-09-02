# Sezeritma

Bilgisayar mühendisliğine yeni başlayanlar için tarayıcıda çalışan, C++ ile algoritma öğreten oyun.

Öğrenci gerçek C++ kodu yazarak çikolata fabrikasındaki stajyer Sezer'i yönetir. Paletlerin arasından geçer, raflardaki çikolataları kapar, vardiya bitmeden mola odasına ulaşır. 16 bölüm boyunca sıralı çalışma, döngü, koşul, değişken ve fonksiyon kavramlarını **kodunun satır satır çalıştığını görerek** öğrenir.

Gerçek olaylardan esinlenilmiştir.

## Neden

Yeni başlayan öğrencinin asıl problemi sözdizimi değil, kodun zamanda aktığını görememesi. `for` döngüsünü ezberliyor ama "şu an 3. tur, `i` iki, karakter burada" resmini kafasında kuramıyor. Bu projenin tek işi o resmi ekrana koymak.

Bunun için üç şey yapıyoruz:

1. **Aktif satır vurgusu** — kod çalışırken editörde o an işlenen satır boyanır. Döngünün başa dönüşü görünür hale gelir.
2. **Değişken izleyici** — `int sayac = 0;` yazıldığı anda yan panelde `sayac: 0 → 1 → 2` akar.
3. **Adım adım çalıştırma** — kod tek tek adımlanabilir, hız ayarlanabilir. Öğrenci hayatındaki ilk hata ayıklayıcıyı farkında olmadan kullanır.

Üçü de ancak C++'ın öğretmemiz gereken alt kümesini kendimiz ayrıştırıp kendimiz yürüttüğümüz için mümkün. Aynı sebeple hata mesajları da öğrencinin anlayacağı dilde: *"3. satırın sonunda noktalı virgül eksik."*

## C++'ın tören yükü

Öğrenci boş bir dosyaya bakmıyor. Editörde kilitli bir iskelet ve içinde kendi alanı var:

```cpp
#include "sezeritma.h"     // kilitli

int main() {               // kilitli
    ilerle();              // öğrencinin alanı
    ilerle();
    return 0;              // kilitli
}
```

`#include` ve `int main()` görünüyor — dersinde karşısına çıktığında yabancı gelmeyecek — ama onları yazmak zorunda değil. 15. bölümde `main()`'in üstünde ikinci bir düzenlenebilir bölme açılıyor ve fonksiyon kavramı orada öğretiliyor.

## Durum

Tasarım aşaması. Kod henüz yok.

| Belge | İçerik |
|---|---|
| [docs/baslangic.md](docs/baslangic.md) | Nereden başlanır, kim neyi yazıyor |
| [docs/tasarim.md](docs/tasarim.md) | Ürün, müfredat, teknik mimari, iş bölümü |
| [docs/bolum-formati.md](docs/bolum-formati.md) | Bölüm yazma formatı ve kuralları |

## Teknoloji

Vite · React · TypeScript · Tailwind · CodeMirror · Vitest. Yorumlayıcı sıfırdan yazılıyor. Backend yok, veritabanı yok, üyelik yok. İlerleme tarayıcıda saklanır.

## Ekip

- **Sedat** — sözcük ayırıcı, ayrıştırıcı, yürütücü, simülasyon, ızgara ve kod editörü
- **Sezer** — bölüm tasarımı, müfredat, Türkçe metinler, arayüzün panel tarafı
