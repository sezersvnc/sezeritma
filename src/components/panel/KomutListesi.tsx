import { useState, type ReactNode } from 'react';
import type { KomutAdi, KomutListesiProps, YapiAdi } from '../../core/types';

const IMZA: Record<KomutAdi, string> = {
  ilerle: 'ilerle();',
  sagaDon: 'sagaDon();',
  solaDon: 'solaDon();',
  kap: 'kap();',
  molaOdasindaMiyim: 'bool molaOdasindaMiyim()',
  onumdePaletVar: 'bool onumdePaletVar()',
  ustumdeCikolataVar: 'bool ustumdeCikolataVar()',
};

const ACIKLAMA: Record<KomutAdi, string> = {
  ilerle: 'Baktığın yöne bir kare gidersin.',
  sagaDon: 'Yerinde sağa dönersin, ilerlemezsin.',
  solaDon: 'Yerinde sola dönersin, ilerlemezsin.',
  kap: 'Bastığın karedeki çikolatayı alırsın.',
  molaOdasindaMiyim: 'Mola odasındaysan doğru.',
  onumdePaletVar: 'Önünde palet varsa doğru.',
  ustumdeCikolataVar: 'Bastığın karede çikolata varsa doğru.',
};

const YAPI: Record<YapiAdi, { imza: string; ne: string }> = {
  for: { imza: 'for (int i = 0; i < n; i++)', ne: 'Kaç kere tekrarlanacağını bildiğinde.' },
  while: { imza: 'while (kosul)', ne: 'Koşul doğru olduğu sürece tekrarlar.' },
  if: { imza: 'if (kosul)', ne: 'Koşul doğruysa içindekini çalıştırır.' },
  else: { imza: 'else', ne: 'Koşul yanlışsa bunu çalıştırır.' },
  degisken: { imza: 'int sayac = 0;', ne: 'Bir sayıyı hatırlar, sonra değiştirebilirsin.' },
  fonksiyon: { imza: 'void isim() { }', ne: 'Kendi komutunu tanımlarsın, adıyla çağırırsın.' },
};

/** Soru soran komutlar cevap döndürür, hareket ettirenler döndürmez. Ayrı şeyler. */
const soruMu = (k: KomutAdi) => IMZA[k].startsWith('bool');

/**
 * Elindeki komutların referansı.
 *
 * Bu bir başvuru listesi, yapılacak iş değil. Geniş ekranda hep açık duruyor;
 * yer dar olduğunda kapalı başlıyor ki oyun alanını ve kod editörünü ezmesin.
 * Gizlemiyoruz, sadece istendiğinde açılıyor.
 */
export function KomutListesi({ izinliKomutlar, izinliYapilar }: KomutListesiProps) {
  const [acik, setAcik] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 1180,
  );

  const sayi = izinliKomutlar.length + izinliYapilar.length;
  const hareketler = izinliKomutlar.filter((k) => !soruMu(k));
  const sorular = izinliKomutlar.filter(soruMu);
  // Liste kısayken başlıklar gereksiz gürültü; uzayınca gruplama okumayı kolaylaştırıyor.
  const baslikliMi = sayi >= 6;

  return (
    <section className="komut-bolumu">
      <button
        className="komut-basligi"
        aria-expanded={acik}
        onClick={() => setAcik((a) => !a)}
      >
        <span className="etiket">Bu bölümde elindekiler</span>
        <span className="komut-sayaci etiket">
          {sayi} madde {acik ? '−' : '+'}
        </span>
      </button>

      {acik && (
        <div className="komut-govdesi">
          <Grup baslik={baslikliMi ? "Sezer'e yaptırdıkların" : undefined}>
            {hareketler.map((k) => (
              <Satir key={k} imza={IMZA[k]} ne={ACIKLAMA[k]} />
            ))}
          </Grup>

          {sorular.length > 0 && (
            <Grup baslik={baslikliMi ? "Sezer'e sorabildiklerin" : undefined}>
              {sorular.map((k) => (
                <Satir key={k} imza={IMZA[k]} ne={ACIKLAMA[k]} />
              ))}
            </Grup>
          )}

          {izinliYapilar.length > 0 && (
            <Grup baslik={baslikliMi ? 'Akışı kuran yapılar' : undefined}>
              {izinliYapilar.map((y) => (
                <Satir key={y} imza={YAPI[y].imza} ne={YAPI[y].ne} />
              ))}
            </Grup>
          )}
        </div>
      )}
    </section>
  );
}

function Grup({ baslik, children }: { baslik?: string; children: ReactNode }) {
  return (
    <div className="komut-grubu">
      {baslik && <h3 className="komut-grup-basligi">{baslik}</h3>}
      <div className="komut-listesi">{children}</div>
    </div>
  );
}

function Satir({ imza, ne }: { imza: string; ne: string }) {
  return (
    <div className="komut">
      <code>{imza}</code>
      <span>{ne}</span>
    </div>
  );
}
