import { TAHMIN_SECENEKLERI, tahminGeriBildirimi, type TahminTuru } from '../../content/tahmin';

/**
 * Tahmin şeridi.
 *
 * Çalıştır'a basmadan önce ne olacağını seçmeni ister. Zorunlu değildir;
 * seçmeden de çalıştırabilirsin. Ama seçtiğinde kodu okumak zorunda kalırsın
 * ve öğrenmenin büyük kısmı orada olur.
 */

interface Props {
  secilen: TahminTuru | null;
  gercek: TahminTuru | null;
  onSec: (tur: TahminTuru) => void;
  onKapat: () => void;
}

export function TahminSeridi({ secilen, gercek, onSec, onKapat }: Props) {
  const tutti = secilen !== null && gercek !== null && secilen === gercek;

  return (
    <section className="tahmin" data-sonuc={gercek ? (tutti ? 'dogru' : 'yanlis') : undefined}>
      <div className="tahmin-bas">
        <span className="etiket">Çalıştırmadan önce tahmin et</span>
        <button className="tahmin-kapat etiket" onClick={onKapat}>
          Kapat
        </button>
      </div>

      <div className="tahmin-secenekler">
        {TAHMIN_SECENEKLERI.map((s) => (
          <button
            key={s.tur}
            className="tahmin-secenek"
            data-secili={secilen === s.tur ? '1' : undefined}
            data-gercek={gercek === s.tur ? '1' : undefined}
            title={s.aciklama}
            aria-pressed={secilen === s.tur}
            onClick={() => onSec(s.tur)}
          >
            {s.metin}
          </button>
        ))}
      </div>

      {secilen && gercek && <p className="tahmin-sonuc">{tahminGeriBildirimi(secilen, gercek)}</p>}
      {secilen && !gercek && (
        <p className="tahmin-sonuc">Tahminin hazır. Şimdi çalıştır ve gör.</p>
      )}
    </section>
  );
}
