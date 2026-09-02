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
  satirSayisi: number;
  onEkle: (komut: KomutAdi) => void;
  onGeriAl: () => void;
  onTemizle: () => void;
}

export function KartModu({ izinliKomutlar, satirSayisi, onEkle, onGeriAl, onTemizle }: Props) {
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

      <div className="kart-arac">
        <button className="dugme" onClick={onGeriAl} disabled={satirSayisi === 0}>
          Son satırı sil
        </button>
        <button className="dugme" onClick={onTemizle} disabled={satirSayisi === 0}>
          Hepsini sil
        </button>
        <span className="etiket kart-sayac">{satirSayisi} satır</span>
      </div>
    </section>
  );
}
