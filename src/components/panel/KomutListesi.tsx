import { useState } from 'react';
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
          <div className="komut-listesi">
            {izinliKomutlar.map((k) => (
              <div key={k} className="komut">
                <code>{IMZA[k]}</code>
                <span>{ACIKLAMA[k]}</span>
              </div>
            ))}
          </div>

          {izinliYapilar.length > 0 && (
            <div className="komut-listesi" style={{ marginTop: 12 }}>
              {izinliYapilar.map((y) => (
                <div key={y} className="komut">
                  <code>{YAPI[y].imza}</code>
                  <span>{YAPI[y].ne}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
