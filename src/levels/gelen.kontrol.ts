import { describe, it, expect, afterAll } from 'vitest';
import { writeFileSync } from 'node:fs';
import { bolumOku, cozumuBol } from './bolumOku';
import { calistir, satirSay } from '../core/yurutucu';

/**
 * `npm run bolum:gelen`
 *
 * docs/bolumler/ altındaki bölüm taslaklarını denetler ve
 * docs/gelen-bolum-raporu.md dosyasına ne düzeltilmesi gerektiğini yazar.
 * Varsayılan `npm test` koşusuna girmez; taslakların kırmızı olması normal.
 */

const dosyalar = import.meta.glob('../../docs/bolumler/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const girdiler = Object.entries(dosyalar).sort(([a], [b]) => a.localeCompare(b));

interface Satir {
  no: number;
  ad: string;
  durum: 'geçti' | 'takıldı';
  aciklama: string;
}

const rapor: Satir[] = [];

describe('gelen bölüm taslakları', () => {
  girdiler.forEach(([yol, metin]) => {
    const no = Number(/(\d+)\.md$/.exec(yol)![1]);

    it(`${String(no).padStart(2, '0')} — biçim ve referans çözüm`, () => {
      let ad = '(okunamadı)';
      let aciklama = '';

      try {
        const bolum = bolumOku(metin, no);
        ad = bolum.ad;
        const kod = cozumuBol(bolum.referansCozum);
        const s = calistir(kod, bolum);
        const kullanilan = satirSay(kod);

        if (s.hata) {
          aciklama = s.hata.mesaj;
        } else if (kullanilan !== bolum.hedefSatir) {
          aciklama = `Çözüm çalışıyor ama hedefSatir ${bolum.hedefSatir} yazılmış, referans çözüm ${kullanilan} satır. İkisi eşit olmalı (süslü parantez satırları sayılmaz).`;
        }
      } catch (h) {
        aciklama = h instanceof Error ? h.message : String(h);
      }

      rapor.push({
        no,
        ad,
        durum: aciklama ? 'takıldı' : 'geçti',
        aciklama: aciklama || 'Sorun yok.',
      });

      expect(`${no} — ${ad}: ${aciklama || 'sorun yok'}`).toContain('sorun yok');
    });
  });
});

afterAll(() => {
  const sirali = [...rapor].sort((a, b) => a.no - b.no);
  const gecen = sirali.filter((s) => s.durum === 'geçti').length;

  const metin = [
    '# Gelen bölüm raporu',
    '',
    `\`npm run bolum:gelen\` çıktısı. ${sirali.length} taslaktan ${gecen} tanesi hazır.`,
    '',
    '| # | Bölüm | Durum | Ne yapılmalı |',
    '|---|---|---|---|',
    ...sirali.map(
      (s) =>
        `| ${String(s.no).padStart(2, '0')} | ${s.ad} | ${s.durum} | ${s.aciklama.replace(/\|/g, '\\|')} |`,
    ),
    '',
  ].join('\n');

  writeFileSync('docs/gelen-bolum-raporu.md', metin, 'utf8');
});
