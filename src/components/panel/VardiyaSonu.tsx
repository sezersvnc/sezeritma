import { useEffect, useRef } from 'react';
import type { VardiyaSonuProps } from '../../core/types';
import { DERSLER, vardiyaBul } from '../../content/dersler';
import { kodluMetin } from './metin';
import { useOdakTuzagi } from './odakTuzagi';

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
  const kap = useOdakTuzagi<HTMLDivElement>();
  const odak = useRef<HTMLButtonElement>(null);
  useEffect(() => odak.current?.focus(), []);

  const verimli = kullanilanSatir <= hedefSatir;
  // Vardiyanın son bölümü geçildiğinde ne öğrenildiğini toparlıyoruz.
  const VARDIYA_SONLARI: Record<number, number> = { 5: 1, 10: 2, 16: 3, 22: 4, 26: 5, 32: 6 };
  const vardiyaOzeti = vardiyaBul(VARDIYA_SONLARI[bolumNo]);
  // O vardiyada açılan kavramları hatırlatıyoruz.
  const VARDIYA_BASLARI: Record<number, number> = { 1: 1, 2: 6, 3: 11, 4: 17, 5: 23, 6: 27 };
  const bas = vardiyaOzeti ? VARDIYA_BASLARI[vardiyaOzeti.no] : 0;
  const ogrenilenler = vardiyaOzeti
    ? DERSLER.filter((d) => d.bolum >= bas && d.bolum <= bolumNo)
    : [];

  return (
    <div className="orti" ref={kap} role="dialog" aria-modal="true" aria-label={`Bölüm ${bolumNo} tamamlandı`}>
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
            {cantada > 0 && (
              <dl className="olcek" style={{ border: 'none', background: 'none', padding: 0 }}>
                <dt className="etiket">Kapılan</dt>
                <dd>{cantada}</dd>
              </dl>
            )}
          </div>

          <p className="vardiya-notu">{vardiyaNotu}</p>

          {vardiyaOzeti && (
            <section className="vardiya-ozeti">
              <span className="etiket">
                Vardiya {vardiyaOzeti.no} bitti: {vardiyaOzeti.ad}
              </span>
              <p>{kodluMetin(vardiyaOzeti.ozet)}</p>

              {ogrenilenler.length > 0 && (
                <div className="ogrenilenler">
                  <span className="etiket">Bu vardiyada öğrendiklerin</span>
                  <div className="ogrenilen-rozetler">
                    {ogrenilenler.map((d) => (
                      <span key={d.bolum} className="ogrenilen">
                        {d.baslik}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="yildiz-kurali">
            <div data-alindi="1">
              <b>1</b> Bölümü çözdün.
            </div>
            <div data-alindi={yildiz >= 2 ? '1' : undefined}>
              <b>2</b> İpucu kullanmadan çözdün.
            </div>
            <div data-alindi={verimli ? '1' : undefined}>
              <b>3</b> {hedefSatir} satır ya da daha azıyla çözdün.
            </div>
          </div>

          <div className="tabela-dugmeler">
            <button ref={odak} className="dugme-koyu etiket" onClick={onSonraki}>
              {sonBolumMu ? 'Vardiyayı bitir' : 'Sonraki bölüm'}
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
