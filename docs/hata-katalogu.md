# Hata mesajları kataloğu

`npm run hata-katalogu` ile üretilir. Öğrencinin en çok göreceği metinler bunlar,
o yüzden arada bir baştan okunmayı hak ediyorlar.

İyi bir mesajın üç işi vardır: ne olduğunu söyler, nerede olduğunu söyler,
ne denenebileceğini söyler.

## Noktalı virgül unutuldu

```cpp
ilerle()
```

> 1. satırın sonunda noktalı virgül eksik.

## Parantez unutuldu

```cpp
ilerle;
```

> 1. satırda `ilerle` komutunu çağırmak için sonuna parantez koymalısın: `ilerle();`

## Süslü parantez kapatılmadı

```cpp
for (int i = 0; i < 3; i++) {
  ilerle();
```

> 1. satırda açtığın süslü parantezi kapatmamışsın.

## Komut adı yanlış yazıldı

```cpp
iIerle();
```

> 1. satırda `iIerle` diye bir komut yok. `ilerle` mi demek istedin?

## Büyük harf hatası

```cpp
Ilerle();
```

> 1. satırda `Ilerle` diye bir komut yok. `ilerle` mi demek istedin?

## cout kullanıldı

```cpp
cout << 5;
```

> 1. satırda bu oyunda `cout` yok. Sezer'i komutlarla yönetiyorsun.

## Tanımsız değişken

```cpp
sayac = 1;
```

> 1. satırda `sayac` diye bir değişken yok. Önce `int sayac = 0;` diye tanımlaman gerekiyor.

## Depo duvarına çarpma

```cpp
ilerle();
ilerle();
ilerle();
ilerle();
```

> 4. satırda deponun duvarına çarptın. Sağa bakıyordun ve depo orada bitiyor.

## Palete çarpma

```cpp
ilerle();
ilerle();
```

> 2. satırda palete çarptın. Sağa bakıyordun ve orada bir palet vardı. `onumdePaletVar()` ile önce kontrol etmeyi deneyebilirsin.

## Boş karede toplama

```cpp
kap();
```

> 1. satırda `kap();` çağırdın ama bastığın karede çikolata yok. `ustumdeCikolataVar()` ile önce bakabilirsin.

## Sonsuz döngü

```cpp
while (true) {
  sagaDon();
}
```

> Kodun hiç bitmedi, sonsuz döngüye girdin. `while` koşulun ne zaman yanlış olacak? Koşulu yanlış yapacak bir şey oluyor mu döngünün içinde?

## Molaya varmadan bitti

```cpp
ilerle();
```

> Kodun bitti ama Sezer mola odasına varamadı. Vardiya bitmeden oraya ulaşması gerekiyor.

## Çikolata bırakıldı

```cpp
ilerle();
ilerle();
ilerle();
```

> Mola odasına ulaştın ama depoda 1 çikolata kaldı. Vardiya bitmeden hepsini toplaman gerekiyor.

## Boş kod

```cpp
(boş)
```

> Henüz kod yazmadın. Sezer ne yapacağını bilmiyor, o yüzden yerinden kıpırdamadı.

## İzin verilmeyen komut

```cpp
kap();
```

> 1. satırda `kap()` kullanmışsın ama bu bölümde o komut henüz açılmadı. Sağdaki listede olanlarla çözebilirsin.

## İzin verilmeyen yapı

```cpp
for (int i = 0; i < 3; i++) {
  ilerle();
}
```

> 1. satırda `for` döngüsü kullanmışsın ama o bu bölümde henüz açılmadı. Elindeki komutlarla çözebilirsin.

## Fonksiyona eksik değer

```cpp
void ilerleN(int n) {
  ilerle();
}
---
ilerleN();
```

> 1. satırda `ilerleN` komutu 1 değer bekliyor ama 0 tane verilmiş.

## Oyun komutuna değer verildi

```cpp
ilerle(3);
```

> 1. satırda `ilerle()` parantezinin içine değer yazılmaz, o komut değer almıyor.

## else tek başına

```cpp
else {
  ilerle();
}
```

> 1. satırdaki `else` bir `if` bloğunun hemen ardından gelmeli.

## Sıfıra bölme

```cpp
int a = 1 / 0;
```

> 1. satırda sıfıra bölme var. Bölen sıfır olamaz.

## Sıfıra bölme, kalan

```cpp
int a = 5 % 0;
```

> 1. satırda sıfıra bölme var. `%` bölmeden kalanı verir, bölen sıfır olamaz.

## Karşılaştırmada tek eşittir

```cpp
int a = 1;
if (a = 3) {
  ilerle();
}
```

> 2. satırda `if` koşulunda tek `=` var. Tek eşittir "şu değeri ata" demek; karşılaştırmak için `==` yazmalısın.

## Aynı değişkeni iki kere tanımlama

```cpp
int a = 1;
int a = 2;
```

> 2. satırda `a` adında bir değişken zaten var. Yeniden tanımlamak yerine `a = ...;` diyerek değerini değiştirebilirsin.

## Değişkene başlangıç değeri yok

```cpp
int a;
```

> 1. satırda `a` değişkenine bir başlangıç değeri vermelisin: `int a = 0;`

## Fazladan kapanış parantezi

```cpp
for (int i = 0; i < 3; i++) {
  ilerle();
}
}
```

> 4. satırda fazladan bir `}` var. Editör süslü parantezi açtığında kapanışını kendisi ekliyor, bir tanesini silmen yeterli.

## Fonksiyon void ile başlamıyor

```cpp
koseDon() {
  ilerle();
}
---
koseDon();
```

> 1. satırda fonksiyon tanımı bekliyordum. Fonksiyonlar `void isim() { }` şeklinde yazılır.
