import { haritaCoz } from '../core/harita';
import { KOMUTLAR, YAPILAR, type Bolum, type KomutAdi, type YapiAdi, type Yon } from '../core/types';

const YONLER: readonly string[] = ['kuzey', 'dogu', 'guney', 'bati'];

/** Fonksiyon bölmesi ile main gövdesini ayıran işaret. */
export const BOLME_AYRACI = '--- main ---';

const bolumler = (metin: string): Map<string, string> => {
  const parcalar = new Map<string, string>();
  let baslik: string | null = null;
  let toplanan: string[] = [];

  const yaz = () => {
    if (baslik) parcalar.set(baslik, toplanan.join('\n').replace(/^\n+|\s+$/g, ''));
  };

  for (const satir of metin.split('\n').map((s) => s.replace(/\r$/, ''))) {
    const eslesme = /^##\s+(\S+)\s*$/.exec(satir);
    if (eslesme) {
      yaz();
      baslik = eslesme[1];
      toplanan = [];
    } else if (baslik) {
      toplanan.push(satir);
    }
  }
  yaz();
  return parcalar;
};

const ustBilgi = (metin: string, alan: string, no: number): string => {
  const eslesme = new RegExp(`^${alan}:\\s*(.*)$`, 'm').exec(metin);
  if (!eslesme) {
    throw new Error(`Bölüm ${no}: "${alan}:" satırı eksik.`);
  }
  return eslesme[1].trim();
};

const liste = <T extends string>(
  ham: string,
  gecerli: readonly T[],
  alan: string,
  no: number,
): T[] => {
  if (ham === '-' || ham === '') return [];
  return ham.split(',').map((p) => {
    const deger = p.trim();
    if (!(gecerli as readonly string[]).includes(deger)) {
      throw new Error(
        `Bölüm ${no}: ${alan} alanında tanımadığım bir değer var: "${deger}". Kullanılabilecekler: ${gecerli.join(', ')}.`,
      );
    }
    return deger as T;
  });
};

/** Sezer'in yazdığı markdown bölüm dosyasını oyunun anladığı Bolum'e çevirir. */
export function bolumOku(metin: string, no: number): Bolum {
  const basligiEslesme = /^#\s*\d+\s*[—-]\s*(.+)$/m.exec(metin);
  if (!basligiEslesme) {
    throw new Error(`Bölüm ${no}: başlık satırı "# ${no} — Bölüm Adı" biçiminde olmalı.`);
  }

  const parcalar = bolumler(metin);
  const al = (ad: string): string => {
    const deger = parcalar.get(ad);
    if (deger === undefined || deger.length === 0) {
      throw new Error(`Bölüm ${no}: "## ${ad}" bölümü eksik veya boş.`);
    }
    return deger;
  };

  const yon = al('Yon');
  if (!YONLER.includes(yon)) {
    throw new Error(
      `Bölüm ${no}: "${yon}" geçerli bir yön değil. Kullanılabilecekler: ${YONLER.join(', ')}.`,
    );
  }

  const harita = haritaCoz(al('Harita'));
  const izinliYapilar = liste(
    ustBilgi(metin, 'izinliYapilar', no),
    YAPILAR,
    'izinliYapilar',
    no,
  ) as YapiAdi[];
  const fonksiyonBolmesi = izinliYapilar.includes('fonksiyon');

  const hedefSatirHam = ustBilgi(metin, 'hedefSatir', no);
  const hedefSatir = Number(hedefSatirHam);
  if (!Number.isInteger(hedefSatir) || hedefSatir < 1) {
    throw new Error(`Bölüm ${no}: hedefSatir bir tam sayı olmalı, "${hedefSatirHam}" yazılmış.`);
  }

  const vardiya = Number(ustBilgi(metin, 'vardiya', no));
  if (![1, 2, 3, 4, 5].includes(vardiya)) {
    throw new Error(`Bölüm ${no}: vardiya 1 ile 5 arasında olmalı.`);
  }

  return {
    no,
    vardiya: vardiya as 1 | 2 | 3 | 4 | 5,
    ad: basligiEslesme[1].trim(),
    kavram: ustBilgi(metin, 'kavram', no),
    gorev: al('Gorev'),
    ipuclari: [al('Ipucu1'), al('Ipucu2')],
    vardiyaNotu: al('VardiyaNotu'),

    izgara: harita.izgara,
    paletler: harita.paletler,
    cikolatalar: harita.cikolatalar,
    mola: harita.mola,
    baslangic: { kare: harita.baslangicKare, yon: yon as Yon },

    izinliKomutlar: liste(
      ustBilgi(metin, 'izinliKomutlar', no),
      KOMUTLAR,
      'izinliKomutlar',
      no,
    ) as KomutAdi[],
    izinliYapilar,
    hedefSatir,
    fonksiyonBolmesi,
    kartModu: izinliYapilar.length === 0,

    baslangicKodu: parcalar.get('BaslangicKodu') ?? '',
    referansCozum: al('Cozum'),
  };
}

/** Referans çözümü iki editör bölmesine ayırır. */
export function cozumuBol(referansCozum: string): { govde: string; fonksiyonlar: string } {
  const i = referansCozum.indexOf(BOLME_AYRACI);
  if (i === -1) return { govde: referansCozum, fonksiyonlar: '' };
  return {
    fonksiyonlar: referansCozum.slice(0, i).trimEnd(),
    govde: referansCozum.slice(i + BOLME_AYRACI.length).replace(/^\n+/, '').trimEnd(),
  };
}
