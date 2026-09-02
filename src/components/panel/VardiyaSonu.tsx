import { useEffect, useRef } from 'react';
import type { VardiyaSonuProps } from '../../core/types';
import { vardiyaBul } from '../../content/dersler';
import { kodluMetin } from './metin';

export function VardiyaSonu({
  bolumNo,
  ad,
  yildiz,
  kullanilanSatir,
  hedefSatir,
  vardiyaNotu,
  cantada,
  sonBolumMu,
  onSonraki,
  onTekrar,
}: VardiyaSonuProps) {
  const odak = useRef<HTMLButtonElement>(null);
  useEffect(() => odak.current?.focus(), []);

  const verimli = kullanilanSatir <= hedefSatir;
  // Vardiyanın son bölümü geçildiğinde ne öğrenildiğini toparlıyoruz.
  const vardiyaOzeti = [4, 8, 12, 16, 19].includes(bolumNo)
    ? vardiyaBul(bolumNo === 19 ? 5 : Math.ceil(bolumNo / 4))
    : undefined;

  return (
    <div className="orti" role="dialog" aria-modal="true" aria-label={`Bölüm ${bolumNo} tamamlandı`}>
      <div className="tabela">
        <div className="serit" />
        <div className="tabela-ic">
          <span className="etiket" style={{ color: 'var(--beton-4)' }}>
            Bölüm {String(bolumNo).padStart(2, '0')} tamamlandı
          </span>
          <h2>{ad}</h2>

          <div className="yildizlar" role="img" aria-label={`${yildiz} yıldız`}>
            {[1, 2, 3].map((i) => (
              <i key={i} data-dolu={i <= yildiz ? '1' : '0'} />
            ))}
          </div>

          <div className="tabela-olcumler">
            <dl className="olcek" style={{ border: 'none', background: 'none', padding: 0 }}>
              <dt className="etiket">Satır</dt>
              <dd style={{ color: verimli ? 'var(--yesil)' : 'var(--folyo)' }}>
                {kullanilanSatir}
                <span style={{ color: 'var(--beton-4)' }}>/{hedefSatir}</span>
              </dd>
            </dl>
            <dl className="olcek" style={{ border: 'none', background: 'none', padding: 0 }}>
              <dt className="etiket">Kapılan</dt>
              <dd>{cantada}</dd>
            </dl>
          </div>

          <p className="vardiya-notu">{vardiyaNotu}</p>

          {vardiyaOzeti && (
            <section className="vardiya-ozeti">
              <span className="etiket">
                Vardiya {vardiyaOzeti.no} bitti — {vardiyaOzeti.ad}
              </span>
              <p>{kodluMetin(vardiyaOzeti.ozet)}</p>
            </section>
          )}

          {!verimli && (
            <p className="etiket" style={{ color: 'var(--beton-4)', marginBottom: 16 }}>
              Üçüncü yıldız için {hedefSatir} satır ve altı gerekiyor
            </p>
          )}

          <div className="tabela-dugmeler">
            <button ref={odak} className="dugme-koyu etiket" onClick={onSonraki}>
              {sonBolumMu ? 'Çizelgeye dön' : 'Sonraki vardiya'}
            </button>
            <button className="dugme-cizgili etiket" onClick={onTekrar}>
              Daha kısa yaz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
