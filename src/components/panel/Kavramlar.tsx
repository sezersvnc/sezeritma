import { useEffect, useState } from 'react';
import { DERSLER, VARDIYALAR } from '../../content/dersler';
import { kodluMetin } from './metin';
import { useOdakTuzagi } from './odakTuzagi';

interface Props {
  bolumNo: number;
  onKapat: () => void;
  /** Yeni kavramda anlatım penceresi kendiliğinden açılsın mı. */
  dersOtomatik: boolean;
  onDersOtomatik: (otomatik: boolean) => void;
}

/**
 * Kavram sözlüğü. Öğrenci bir kavramı unuttuğunda geri dönebilsin diye
 * her zaman açık; henüz gelmediği kavramlar kilitli görünür ki merak etsin
 * ama şaşırmasın.
 */
export function Kavramlar({ bolumNo, onKapat, dersOtomatik, onDersOtomatik }: Props) {
  const kap = useOdakTuzagi<HTMLDivElement>();
  const [acik, setAcik] = useState<number | null>(
    [...DERSLER].reverse().find((d) => d.bolum <= bolumNo)?.bolum ?? null,
  );

  useEffect(() => {
    const kapat = (e: KeyboardEvent) => e.key === 'Escape' && onKapat();
    window.addEventListener('keydown', kapat);
    return () => window.removeEventListener('keydown', kapat);
  }, [onKapat]);

  return (
    <div className="orti" ref={kap} role="dialog" aria-modal="true" aria-label="Öğrendiğin kavramlar">
      <div className="tabela ders-tabelasi">
        <div className="serit" />
        <div className="tabela-ic ders-ic">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 22 }}>Öğrendiğin kavramlar</h2>
            <button className="dugme-cizgili etiket" onClick={onKapat}>
              Kapat
            </button>
          </div>

          <p className="ders-metin" style={{ marginTop: 6 }}>
            Her kavram, ilk kullanıldığı bölümde açılır. Unuttuğunda buraya dönebilirsin.
          </p>

          <label className="anahtar">
            <input
              type="checkbox"
              checked={dersOtomatik}
              onChange={(e) => onDersOtomatik(e.target.checked)}
            />
            <span>
              Yeni kavramda anlatımı kendiliğinden aç
              <em>
                Kapalıyken hiçbir pencere önüne çıkmaz. Anlatımı istediğinde görev kartındaki
                <b> anlatımı aç</b> bağlantısından okursun.
              </em>
            </span>
          </label>

          {VARDIYALAR.map((v) => {
            const dersler = DERSLER.filter((d) => {
              const bolum = d.bolum;
              return (
                (v.no === 1 && bolum <= 5) ||
                (v.no === 2 && bolum >= 6 && bolum <= 10) ||
                (v.no === 3 && bolum >= 11 && bolum <= 16) ||
                (v.no === 4 && bolum >= 17 && bolum <= 22) ||
                (v.no === 5 && bolum >= 23 && bolum <= 26) ||
                (v.no === 6 && bolum >= 27)
              );
            });
            if (dersler.length === 0) return null;

            return (
              <section key={v.no} className="kavram-blogu">
                <h3 className="etiket">
                  Vardiya {v.no}: {v.ad}
                </h3>
                {dersler.map((d) => {
                  const kilitli = d.bolum > bolumNo;
                  const secili = acik === d.bolum;
                  return (
                    <div key={d.bolum} className="kavram-satiri">
                      <button
                        className="kavram-baslik"
                        disabled={kilitli}
                        aria-expanded={secili}
                        onClick={() => setAcik(secili ? null : d.bolum)}
                      >
                        <span className="etiket kavram-no">
                          {String(d.bolum).padStart(2, '0')}
                        </span>
                        <strong>{kilitli ? 'Henüz açılmadı' : d.baslik}</strong>
                      </button>
                      {secili && !kilitli && (
                        <div className="kavram-govde">
                          <p>{kodluMetin(d.hatirla)}</p>
                          <div className="ders-ornek">
                            {d.ornek.map((satir, i) => (
                              <div key={i} className="ders-satir">
                                <code>{satir.kod || ' '}</code>
                                {satir.not && <span>{kodluMetin(satir.not)}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
