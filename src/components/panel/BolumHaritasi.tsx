import { useEffect } from 'react';
import { BOLUMLER } from '../../levels';
import type { BolumHaritasiProps } from '../../core/types';

const VARDIYA_ADI: Record<number, string> = {
  1: 'Üretim Hattı',
  2: 'İstif Deposu',
  3: 'Sevkiyat Bölgesi',
  4: 'Gece Vardiyası',
  5: 'Hata Ayıklama',
};

export function BolumHaritasi({ bolumler, suAnki, onSec, onKapat }: BolumHaritasiProps) {
  useEffect(() => {
    const kapat = (e: KeyboardEvent) => e.key === 'Escape' && onKapat();
    window.addEventListener('keydown', kapat);
    return () => window.removeEventListener('keydown', kapat);
  }, [onKapat]);

  const vardiyalar = [1, 2, 3, 4, 5] as const;

  return (
    <div className="orti" role="dialog" aria-modal="true" aria-label="Vardiya çizelgesi">
      <div className="tabela harita-tabelasi">
        <div className="serit" />
        <div className="tabela-ic">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 22 }}>Vardiya çizelgesi</h2>
            <button className="dugme-cizgili etiket" onClick={onKapat}>
              Kapat
            </button>
          </div>

          {vardiyalar.map((v) => {
            const bolumlerinVardiyasi = BOLUMLER.filter((b) => b.vardiya === v);
            if (bolumlerinVardiyasi.length === 0) return null;

            return (
              <div key={v} className="vardiya-blogu">
                <h3 className="etiket">
                  Vardiya {v} — {VARDIYA_ADI[v] ?? ''}
                </h3>
                <div className="bolum-rafi">
                  {bolumlerinVardiyasi.map((b) => {
                    const ilerleme = bolumler.find((i) => i.no === b.no);
                    const acik = ilerleme?.acik ?? false;
                    return (
                      <button
                        key={b.no}
                        className="bolum-fisi"
                        data-simdi={b.no === suAnki ? '1' : undefined}
                        disabled={!acik}
                        onClick={() => onSec(b.no)}
                        title={acik ? b.kavram : 'Önceki bölümü geçince açılır'}
                      >
                        <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                          {String(b.no).padStart(2, '0')}
                        </span>
                        <strong>{acik ? b.ad : 'Kilitli'}</strong>
                        <span className="mini-yildiz">
                          {[1, 2, 3].map((i) => (
                            <i key={i} data-dolu={i <= (ilerleme?.yildiz ?? 0) ? '1' : '0'} />
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
