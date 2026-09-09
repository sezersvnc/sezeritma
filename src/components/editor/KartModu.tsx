import type { KomutAdi } from '../../core/types';

/**
 * Kart modu.
 *
 * Hiç kod yazmamış biri boş bir editöre bakınca donar. Burada yazmıyor:
 * komuta tıklıyor, satır kendiliğinden yazılıyor. Ürettiği şey gerçek C++.
 * Yani ilk günden itibaren doğru kodu görüyor, sadece yazma yükü kalkıyor.
 */

const ETIKET: Record<KomutAdi, { ad: string; ne: string }> = {
  ilerle: { ad: 'ilerle', ne: 'bir kare git' },
  sagaDon: { ad: 'sagaDon', ne: 'sağa dön' },
  solaDon: { ad: 'solaDon', ne: 'sola dön' },
  kap: { ad: 'kap', ne: 'çikolatayı al' },
  molaOdasindaMiyim: { ad: 'molaOdasindaMiyim', ne: 'mola odasında mıyım' },
  onumdePaletVar: { ad: 'onumdePaletVar', ne: 'önümde palet var mı' },
  ustumdeCikolataVar: { ad: 'ustumdeCikolataVar', ne: 'üstümde çikolata var mı' },
};

/** Kart modu sadece komut dizisi kuran bölümlerde; sorgular oraya girmez. */
const KART_KOMUTLARI: readonly KomutAdi[] = ['ilerle', 'sagaDon', 'solaDon', 'kap'];

interface Props {
  izinliKomutlar: readonly KomutAdi[];
  /** Kurulmuş program, satır satır. */
  satirlar: readonly string[];
  /** Yeni kart bunun altına eklenir; null ise sona. */
  secilenSatir: number | null;
  onEkle: (komut: KomutAdi) => void;
  onSil: (index: number) => void;
  onSec: (index: number | null) => void;
  onTemizle: () => void;
}

export function KartModu({
  izinliKomutlar,
  satirlar,
  secilenSatir,
  onEkle,
  onSil,
  onSec,
  onTemizle,
}: Props) {
  const kartlar = KART_KOMUTLARI.filter((k) => izinliKomutlar.includes(k));

  return (
    <section className="kart-modu">
      <p className="kart-aciklama">
        Komuta bas, satır yukarıda kendiliğinden yazılsın. Sırayı sen kuruyorsun,
        bilgisayar da tam olarak dizdiğin sırayla çalıştırıyor.
      </p>

      <div className="kartlar">
        {kartlar.map((k) => (
          <button key={k} className="kart" onClick={() => onEkle(k)}>
            <code>{ETIKET[k].ad}();</code>
            <span>{ETIKET[k].ne}</span>
          </button>
        ))}
      </div>

      {satirlar.length > 0 && (
        <ol className="kart-satirlari">
          {satirlar.map((satir, i) => (
            <li key={i} data-secili={secilenSatir === i ? '1' : undefined}>
              <button
                className="kart-satir-sec"
                aria-pressed={secilenSatir === i}
                onClick={() => onSec(secilenSatir === i ? null : i)}
              >
                <span className="kart-satir-no">{i + 1}</span>
                <code>{satir}</code>
              </button>
              <button
                className="kart-satir-sil"
                aria-label={`${i + 1}. satırı sil`}
                onClick={() => onSil(i)}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="kart-arac">
        <span className="kart-ipucu">
          {secilenSatir === null
            ? 'Yeni satır en sona eklenir. Araya eklemek için bir satıra bas.'
            : `Yeni satır ${secilenSatir + 1}. satırın altına eklenir. Seçimi bırakmak için tekrar bas.`}
        </span>
        <button className="dugme" onClick={onTemizle} disabled={satirlar.length === 0}>
          Hepsini sil
        </button>
      </div>
    </section>
  );
}
