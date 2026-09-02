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

const YAPI_ETIKET: Record<YapiAdi, string> = {
  for: 'for',
  while: 'while',
  if: 'if',
  else: 'else',
  degisken: 'int / bool',
  fonksiyon: 'void isim()',
};

export function KomutListesi({ izinliKomutlar, izinliYapilar }: KomutListesiProps) {
  return (
    <section>
      <div className="etiket" style={{ color: 'var(--beton-4)', marginBottom: 8 }}>
        Bu bölümde elindekiler
      </div>

      <div className="komut-listesi">
        {izinliKomutlar.map((k) => (
          <div key={k} className="komut">
            <code>{IMZA[k]}</code>
            <span>{ACIKLAMA[k]}</span>
          </div>
        ))}
      </div>

      {izinliYapilar.length > 0 && (
        <div className="yapi-rozetleri">
          {izinliYapilar.map((y) => (
            <span key={y} className="yapi-rozeti">
              {YAPI_ETIKET[y]}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
