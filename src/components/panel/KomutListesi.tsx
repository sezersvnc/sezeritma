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
        <div className="komut-listesi" style={{ marginTop: 12 }}>
          {izinliYapilar.map((y) => (
            <div key={y} className="komut">
              <code>{YAPI[y].imza}</code>
              <span>{YAPI[y].ne}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
