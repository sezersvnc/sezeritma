import { useEffect, useRef } from 'react';
import type { Ders, Vardiya } from '../../content/dersler';
import { kodluMetin } from './metin';

interface Props {
  ders?: Ders;
  /** Yeni bir vardiyaya giriliyorsa dersten önce vardiya tanıtımı gösterilir. */
  vardiya?: Vardiya;
  onKapat: () => void;
  onKavramlar: () => void;
}

const paragraflar = (metin: string) =>
  metin.split('\n\n').map((p, i) => <p key={i}>{kodluMetin(p)}</p>);

export function DersKarti({ ders, vardiya, onKapat, onKavramlar }: Props) {
  const odak = useRef<HTMLButtonElement>(null);
  useEffect(() => odak.current?.focus(), []);
  useEffect(() => {
    const kapat = (e: KeyboardEvent) => e.key === 'Escape' && onKapat();
    window.addEventListener('keydown', kapat);
    return () => window.removeEventListener('keydown', kapat);
  }, [onKapat]);

  return (
    <div className="orti" role="dialog" aria-modal="true" aria-label={ders?.baslik ?? vardiya?.ad}>
      <div className="tabela ders-tabelasi">
        <div className="serit" />
        <div className="tabela-ic ders-ic">
          {vardiya && (
            <section className="vardiya-girisi">
              <span className="etiket">
                Vardiya {vardiya.no} · {vardiya.ad}
              </span>
              <p>{kodluMetin(vardiya.giris)}</p>
            </section>
          )}

          {ders && (
            <>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Yeni kavram
              </span>
              <h2>{ders.baslik}</h2>

              <div className="ders-metin">
                {paragraflar(ders.neden)}
                {paragraflar(ders.nasil)}
              </div>

              <div className="ders-ornek">
                {ders.ornek.map((satir, i) => (
                  <div key={i} className="ders-satir">
                    <code>{satir.kod || ' '}</code>
                    {satir.not && <span>{kodluMetin(satir.not)}</span>}
                  </div>
                ))}
              </div>

              <p className="ders-hatirla">
                <span className="etiket">Aklında kalsın</span>
                {kodluMetin(ders.hatirla)}
              </p>
            </>
          )}

          <div className="tabela-dugmeler">
            <button ref={odak} className="dugme-koyu etiket" onClick={onKapat}>
              Bölüme başla
            </button>
            <button className="dugme-cizgili etiket" onClick={onKavramlar}>
              Önceki kavramlar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
