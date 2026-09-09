import { useEffect, useMemo, useRef } from 'react';
import type { Adim, Hata } from '../../core/types';
import { adimAnlat } from '../../content/anlatici';

/**
 * Çalışma dökümü.
 *
 * Öğrenci hatalı kodun neden hatalı olduğunu, sonucuna bakarak anlayamaz;
 * aradaki adımları görmesi gerekir. Burası kodun kendi anlattığı yer:
 * her çalışan satır, ne yaptığıyla birlikte sırayla yazılır.
 *
 * Döngü çalıştığında aynı satır tekrar tekrar dökülür. Bu bir gürültü değil,
 * dersin kendisi: döngünün "açılışını" öğrenci burada gözüyle görür.
 */

/** Uzun koşularda ekrana son adımlar yazılır, tarayıcı binlerce satırla boğuşmaz. */
const PENCERE = 80;

interface Props {
  adimlar: readonly Adim[];
  adimIndex: number;
  hata: Hata | undefined;
  /** Oynatma bitmeden hata yazılmaz, öğrenci sonu kendisi görsün. */
  hataGoster: boolean;
}

export function Dokum({ adimlar, adimIndex, hata, hataGoster }: Props) {
  const listeRef = useRef<HTMLOListElement>(null);
  const gorunen = Math.max(0, adimIndex + 1);

  const satirlar = useMemo(() => {
    const bas = Math.max(0, gorunen - PENCERE);
    return adimlar.slice(bas, gorunen).map((adim, i) => ({
      no: bas + i + 1,
      satir: adim.satir,
      metin: adimAnlat(adim, bas + i > 0 ? adimlar[bas + i - 1] : undefined).replace(
        /^\d+\. satır: /,
        '',
      ),
    }));
  }, [adimlar, gorunen]);

  const atlanan = Math.max(0, gorunen - PENCERE);

  useEffect(() => {
    // scrollIntoView sayfanın tamamını kaydırabiliyor; sadece listeyi kaydırıyoruz.
    const liste = listeRef.current;
    if (liste) liste.scrollTop = liste.scrollHeight;
  }, [gorunen]);

  if (gorunen === 0) {
    return (
      <div className="dokum dokum-bos">
        <p>
          Çalıştır düğmesine bastığında kodun her satırı burada tek tek yazılacak. Nerede ne
          olduğunu buradan takip edebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="dokum">
      <div className="dokum-baslik">
        <span className="etiket">Çalışma dökümü</span>
        <span className="etiket dokum-sayac">{gorunen} adım</span>
      </div>
      <ol className="dokum-liste" ref={listeRef} aria-live="polite">
        {atlanan > 0 && (
          <li className="dokum-atlanan">önceki {atlanan} adım yukarıda kaldı</li>
        )}
        {satirlar.map((s, i) => (
          <li
            key={s.no}
            data-son={i === satirlar.length - 1 ? '1' : undefined}
          >
            <span className="dokum-satir">{s.satir}</span>
            <span className="dokum-metin">{s.metin}</span>
          </li>
        ))}
        {/* Satırı belli olan hatalarda dökümün sonu, hatanın yerini işaret eder.
            Satırsız hatalar (mola odasına varamamak gibi) zaten sağda anlatılıyor. */}
        {hata && hataGoster && hata.satir > 0 && (
          <li className="dokum-hata">
            <span className="dokum-satir">{hata.satir}</span>
            <span className="dokum-metin">Program burada durdu.</span>
          </li>
        )}
      </ol>
    </div>
  );
}
