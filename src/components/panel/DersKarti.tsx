import { useEffect, useMemo, useRef, useState } from 'react';
import type { Ders, Vardiya } from '../../content/dersler';
import { DersDemo } from './DersDemo';
import { kodluMetin } from './metin';

/**
 * Ders kartı.
 *
 * Üç adım: öğren, izle, uygula. Öğrenci önce kavramı okuyor, sonra aynı
 * kavramın çalışmasını izliyor, sonra bölümde kendi deniyor. Adımlar
 * sağdaki okla ilerliyor.
 */

interface Props {
  ders?: Ders;
  /** Yeni bir vardiyaya giriliyorsa dersten önce vardiya tanıtımı gösterilir. */
  vardiya?: Vardiya;
  onKapat: () => void;
  onKavramlar: () => void;
}

export function DersKarti({ ders, vardiya, onKapat, onKavramlar }: Props) {
  const adimlar = useMemo(() => {
    const liste: ('vardiya' | 'ogren' | 'izle' | 'uygula')[] = [];
    if (vardiya) liste.push('vardiya');
    if (ders) {
      liste.push('ogren');
      if (ders.demo) liste.push('izle');
      liste.push('uygula');
    }
    return liste.length > 0 ? liste : (['uygula'] as const);
  }, [ders, vardiya]);

  const [i, setI] = useState(0);
  const odak = useRef<HTMLButtonElement>(null);
  const adim = adimlar[Math.min(i, adimlar.length - 1)];
  const sonAdim = i >= adimlar.length - 1;

  useEffect(() => odak.current?.focus(), [i]);
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onKapat();
      if (e.key === 'ArrowRight' && !sonAdim) setI((n) => n + 1);
      if (e.key === 'ArrowLeft' && i > 0) setI((n) => n - 1);
    };
    window.addEventListener('keydown', dinle);
    return () => window.removeEventListener('keydown', dinle);
  }, [onKapat, sonAdim, i]);

  return (
    <div className="orti" role="dialog" aria-modal="true" aria-label={ders?.baslik ?? vardiya?.ad}>
      <div className="tabela ders-tabelasi">
        <div className="serit" />
        <div className="tabela-ic ders-ic">
          {adim === 'vardiya' && vardiya && (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Yeni vardiya
              </span>
              <h2>
                {vardiya.no}. Vardiya · {vardiya.ad}
              </h2>
              <p className="ders-giris">{kodluMetin(vardiya.giris)}</p>
            </section>
          )}

          {adim === 'ogren' && ders && (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Öğren
              </span>
              <h2>{ders.baslik}</h2>
              <p className="ders-giris">{kodluMetin(ders.neden)}</p>

              <ul className="ders-maddeler">
                {ders.nasil.map((madde, n) => (
                  <li key={n}>{kodluMetin(madde)}</li>
                ))}
              </ul>

              <div className="ders-ornek">
                {ders.ornek.map((satir, n) => (
                  <div key={n} className="ders-satir">
                    <code>{satir.kod || ' '}</code>
                    {satir.not && <span>{kodluMetin(satir.not)}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {adim === 'izle' && ders?.demo && (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                İzle
              </span>
              <h2>Çalışırken gör</h2>
              <p className="ders-giris">
                Aşağıdaki kod gerçekten çalışıyor. İzle düğmesine bas, hangi satırın ne yaptığını
                takip et.
              </p>
              <DersDemo demo={ders.demo} />
            </section>
          )}

          {adim === 'uygula' && (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Uygula
              </span>
              <h2>Sıra sende</h2>
              {ders && (
                <p className="ders-hatirla">
                  <span className="etiket">Aklında kalsın</span>
                  {kodluMetin(ders.hatirla)}
                </p>
              )}
              <p className="ders-giris">
                Takılırsan görev kartındaki <b>anlatımı aç</b> bağlantısıyla buraya geri
                dönebilirsin. İpucu düğmesi de her zaman yerinde.
              </p>
            </section>
          )}

          <div className="ders-gezinme">
            <div className="ders-noktalar" aria-hidden="true">
              {adimlar.map((_, n) => (
                <i key={n} data-dolu={n <= i ? '1' : undefined} />
              ))}
            </div>

            {i > 0 && (
              <button className="dugme-cizgili etiket" onClick={() => setI((n) => n - 1)}>
                Geri
              </button>
            )}
            <button className="dugme-cizgili etiket" onClick={onKavramlar}>
              Kavramlar
            </button>

            {sonAdim ? (
              <button ref={odak} className="dugme-koyu etiket ileri" onClick={onKapat}>
                Bölüme başla
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                ref={odak}
                className="dugme-koyu etiket ileri"
                onClick={() => setI((n) => n + 1)}
              >
                Devam
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
