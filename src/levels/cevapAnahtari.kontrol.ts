import { describe, it, expect, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { BOLUMLER } from './index';
import { cozumuBol, BOLME_AYRACI } from './bolumOku';
import { calistir, satirSay } from '../core/yurutucu';

/**
 * `npm run cevap-anahtari`
 * Bütün bölümlerin çalıştığı doğrulanmış çözümlerini tek dosyada toplar.
 * Öğrenciye gösterilmez; oyunu anlatırken ve takılan birine yardım ederken kullanılır.
 */

const parcalar: string[] = [];

describe('cevap anahtarı', () => {
  BOLUMLER.forEach((bolum) => {
    it(`${String(bolum.no).padStart(2, '0')} — ${bolum.ad}`, () => {
      const kod = cozumuBol(bolum.referansCozum);
      const s = calistir(kod, bolum);
      expect(s.basarili).toBe(true);

      const gorulen = bolum.referansCozum.includes(BOLME_AYRACI)
        ? bolum.referansCozum.replace(BOLME_AYRACI, '// --- buradan aşağısı main() içine ---')
        : bolum.referansCozum;

      parcalar.push(
        [
          `## ${String(bolum.no).padStart(2, '0')} — ${bolum.ad}`,
          '',
          `**Vardiya ${bolum.vardiya} · ${bolum.kavram}**`,
          '',
          `Görev: ${bolum.gorev}`,
          '',
          `Hedef ${bolum.hedefSatir} satır · bu çözüm ${satirSay(kod)} satır · çikolata ${bolum.cikolatalar.length} · ${s.adimlar.length} adım`,
          '',
          '```cpp',
          gorulen,
          '```',
          '',
          `1. ipucu: ${bolum.ipuclari[0]}`,
          '',
          `2. ipucu: ${bolum.ipuclari[1]}`,
          '',
          `Vardiya notu: ${bolum.vardiyaNotu}`,
          '',
        ].join('\n'),
      );
    });
  });
});

afterAll(() => {
  const metin = [
    '# Cevap anahtarı',
    '',
    'Bütün bölümlerin çalıştığı doğrulanmış çözümleri. `npm run cevap-anahtari` ile yeniden üretilir —',
    'yani bölüm değişirse buradaki çözüm de otomatik güncellenir, elle düzeltmeye gerek yok.',
    '',
    'Öğrenciye gösterilecek bir belge değil: oyunu anlatırken, demo yaparken ve takılan birine',
    'yardım ederken kullanılıyor. Yazılan kod tam olarak `main()` gövdesine girer; `#include` ve',
    '`int main()` satırlarını öğrenci zaten yazmıyor.',
    '',
    '---',
    '',
    ...parcalar,
  ].join('\n');

  writeFileSync('docs/cevap-anahtari.md', metin, 'utf8');
});
