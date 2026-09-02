import type { Degiskenler, Durum } from '../../core/types';

interface Props {
  durum: Durum;
  toplamCikolata: number;
  adimNo: number;
  toplamAdim: number;
  degiskenler: Degiskenler;
}

export function DurumSeridi({ durum, toplamCikolata, adimNo, toplamAdim, degiskenler }: Props) {
  const girdiler = Object.entries(degiskenler);

  return (
    <div className="durum-seridi">
      <dl className="olcek">
        <dt className="etiket">Çantada</dt>
        <dd>
          {durum.cantada}
          <span style={{ color: 'var(--beton-4)' }}>/{toplamCikolata}</span>
        </dd>
      </dl>
      <dl className="olcek">
        <dt className="etiket">Adım</dt>
        <dd>
          {adimNo}
          <span style={{ color: 'var(--beton-4)' }}>/{toplamAdim}</span>
        </dd>
      </dl>

      {girdiler.length > 0 && (
        <div className="olcek degiskenler" aria-live="polite">
          <span className="etiket" style={{ color: 'var(--beton-4)' }}>
            Değişkenler
          </span>
          {girdiler.map(([ad, deger]) => (
            <span key={ad} className="degisken">
              <em>{ad}</em> <b>{typeof deger === 'boolean' ? (deger ? 'true' : 'false') : deger}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
