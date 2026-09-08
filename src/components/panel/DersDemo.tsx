import { useEffect, useMemo, useState } from 'react';
import { Izgara } from '../sahne/Izgara';
import { bolumUret, haritaOku } from '../../serbest/harita';
import { cozumuBol } from '../../levels/bolumOku';
import { calistir } from '../../core/yurutucu';
import { kodluMetin } from './metin';
import type { Demo } from '../../content/dersler';
import type { Durum } from '../../core/types';

/**
 * Ders gösterisi.
 *
 * Öğrenci kavramı okuyor, sonra burada çalışırken izliyor, sonra bölümde
 * kendi deniyor. Gösteri gerçek motorda koşuyor: aynı kurallar, aynı
 * animasyon, aynı satır vurgusu.
 */

const GECIKME = 520;

export function DersDemo({ demo }: { demo: Demo }) {
  const kod = useMemo(() => cozumuBol(demo.kod), [demo]);

  const { bolum, sonuc } = useMemo(() => {
    const b = bolumUret({ hucreler: haritaOku(demo.harita.join('\n')), yon: demo.yon }, kod);
    return { bolum: b, sonuc: calistir(kod, b) };
  }, [demo, kod]);

  const [index, setIndex] = useState(-1);
  const [oynuyor, setOynuyor] = useState(false);

  useEffect(() => {
    setIndex(-1);
    setOynuyor(false);
  }, [demo]);

  useEffect(() => {
    if (!oynuyor) return;
    const id = setTimeout(() => {
      setIndex((i) => {
        if (i >= sonuc.adimlar.length - 1) {
          setOynuyor(false);
          return i;
        }
        return i + 1;
      });
    }, GECIKME);
    return () => clearTimeout(id);
  }, [oynuyor, index, sonuc.adimlar.length]);

  const adim = index >= 0 ? sonuc.adimlar[index] : undefined;
  const durum: Durum = adim?.durum ?? {
    kare: bolum.baslangic.kare,
    yon: bolum.baslangic.yon,
    kalanCikolatalar: bolum.cikolatalar,
    cantada: 0,
  };
  const iz = sonuc.adimlar.slice(0, index + 1).map((a) => a.durum.kare);
  const bitti = index >= sonuc.adimlar.length - 1;

  const govdeSatirlari = kod.govde.split('\n');
  const fonksiyonSatirlari = kod.fonksiyonlar ? kod.fonksiyonlar.split('\n') : [];
  const degiskenler = Object.entries(adim?.degiskenler ?? {});

  return (
    <div className="ders-demo">
      <div className="ders-demo-ust">
        <Izgara bolum={bolum} durum={durum} iz={iz} />

        <div className="ders-demo-kod">
          {fonksiyonSatirlari.length > 0 && (
            <>
              <span className="etiket ders-demo-etiket">Kendi komutların</span>
              {fonksiyonSatirlari.map((satir, i) => (
                <code
                  key={`f${i}`}
                  data-aktif={adim?.bolme === 'fonksiyon' && adim.satir === i + 1 ? '1' : undefined}
                >
                  {satir || ' '}
                </code>
              ))}
              <span className="etiket ders-demo-etiket">main içinde</span>
            </>
          )}
          {govdeSatirlari.map((satir, i) => (
            <code
              key={`g${i}`}
              data-aktif={adim?.bolme === 'govde' && adim.satir === i + 1 ? '1' : undefined}
            >
              {satir || ' '}
            </code>
          ))}
        </div>
      </div>

      <div className="ders-demo-alt">
        <button
          className="dugme dugme-birincil"
          onClick={() => {
            if (bitti) setIndex(-1);
            setOynuyor(!oynuyor || bitti);
          }}
        >
          {oynuyor ? 'Duraklat' : bitti ? 'Baştan izle' : index < 0 ? 'İzle' : 'Devam et'}
        </button>
        <button
          className="dugme"
          onClick={() => {
            setOynuyor(false);
            setIndex((i) => Math.min(i + 1, sonuc.adimlar.length - 1));
          }}
          disabled={bitti}
        >
          Tek adım
        </button>

        <span className="ders-demo-sayac etiket">
          {index + 1} / {sonuc.adimlar.length} adım
        </span>

        {degiskenler.length > 0 && (
          <span className="ders-demo-degisken">
            {degiskenler.map(([ad, deger]) => (
              <span key={ad}>
                {ad} = <b>{typeof deger === 'boolean' ? (deger ? 'true' : 'false') : deger}</b>
              </span>
            ))}
          </span>
        )}
      </div>

      <p className="ders-demo-anlat">{kodluMetin(demo.anlat)}</p>
    </div>
  );
}
