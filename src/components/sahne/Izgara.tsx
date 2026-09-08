import { useMemo, useState, type CSSProperties } from 'react';
import type { Bolum, Durum, Kare, Yon } from '../../core/types';

const ACI: Record<Yon, number> = { kuzey: 0, dogu: 90, guney: 180, bati: 270 };

const anahtar = (k: Kare) => `${k.x},${k.y}`;

/**
 * Karenin alabileceği en büyük boy. Gerçek boy bundan küçük olabilir:
 * ızgara sütun sayısına göre esniyor, dar ekranda kareler kendiliğinden
 * küçülüyor. Bu yüzden boy piksel olarak sabitlenmiyor, tavan olarak veriliyor.
 */
const enBuyukKare = (genislik: number, yukseklik: number) =>
  Math.round(Math.max(30, Math.min(64, 620 / Math.max(genislik, yukseklik))));

interface Props {
  bolum: Bolum;
  durum: Durum;
  iz: readonly Kare[];
  /** Serbest modda hücrelere tıklayarak harita çizilir. */
  duzenlenebilir?: boolean;
  onHucre?: (x: number, y: number) => void;
}

export function Izgara({ bolum, durum, iz, duzenlenebilir = false, onHucre }: Props) {
  const [boyaniyor, setBoyaniyor] = useState(false);
  const { genislik, yukseklik } = bolum.izgara;

  // Dış duvar halkası hücre olarak çizilmiyor: çerçevenin kendisi o duvar.
  const icGenislik = genislik - 2;
  const icYukseklik = yukseklik - 2;

  const paletSeti = useMemo(() => new Set(bolum.paletler.map(anahtar)), [bolum]);
  const izSeti = useMemo(() => new Set(iz.map(anahtar)), [iz]);
  const kalanSeti = useMemo(() => new Set(durum.kalanCikolatalar.map(anahtar)), [durum]);

  const hucreler = [];
  for (let y = 1; y <= icYukseklik; y++) {
    for (let x = 1; x <= icGenislik; x++) {
      const a = anahtar({ x, y });
      const palet = paletSeti.has(a);
      const mola = bolum.mola.x === x && bolum.mola.y === y;
      const cikolataVardi = bolum.cikolatalar.some((c) => anahtar(c) === a);

      const ortak = {
        className: 'hucre',
        'data-tip': palet ? 'palet' : mola ? 'mola' : 'zemin',
        'data-iz': !palet && izSeti.has(a) ? '1' : undefined,
        'data-aktif': durum.kare.x === x && durum.kare.y === y ? '1' : undefined,
      } as const;

      const icerik = cikolataVardi ? (
        <span className="cikolata" data-alindi={kalanSeti.has(a) ? '0' : '1'} />
      ) : null;

      hucreler.push(
        duzenlenebilir ? (
          <button
            key={a}
            {...ortak}
            type="button"
            aria-label={`${x}. sütun, ${y}. satır`}
            onPointerDown={(e) => {
              // Parmakla sürükleyince tarayıcı sayfayı kaydırmasın.
              e.currentTarget.releasePointerCapture?.(e.pointerId);
              setBoyaniyor(true);
              onHucre?.(x, y);
            }}
            onPointerUp={() => setBoyaniyor(false)}
            onPointerEnter={() => boyaniyor && onHucre?.(x, y)}
          >
            {icerik}
          </button>
        ) : (
          <div key={a} {...ortak}>
            {icerik}
          </div>
        ),
      );
    }
  }

  return (
    <div
      className="zemin-cerceve"
      style={
        {
          '--kare': `${enBuyukKare(icGenislik, icYukseklik)}px`,
          '--sutun': icGenislik,
          '--satir': icYukseklik,
        } as CSSProperties
      }
    >
      <div
        className="zemin"
        data-duzenlenebilir={duzenlenebilir ? '1' : undefined}
        onPointerLeave={() => setBoyaniyor(false)}
        onPointerCancel={() => setBoyaniyor(false)}
        role={duzenlenebilir ? 'group' : 'img'}
        aria-label={`${icGenislik}e ${icYukseklik} depo zemini. Sezer ${durum.kare.x}. sütun, ${durum.kare.y}. satırda, ${durum.yon} yönüne bakıyor.`}
      >
        {hucreler}
        <div
          className="sezer"
          style={{ '--x': durum.kare.x - 1, '--y': durum.kare.y - 1 } as CSSProperties}
        >
          <div className="sezer-govde" style={{ transform: `rotate(${ACI[durum.yon]}deg)` }}>
            <span className="sezer-burun" />
          </div>
        </div>
      </div>
    </div>
  );
}
