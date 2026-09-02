import type { UstBarProps } from '../../core/types';

export function UstBar({
  bolumNo,
  toplamBolum,
  vardiya,
  toplamYildiz,
  enFazlaYildiz,
  onHaritaAc,
}: UstBarProps) {
  return (
    <header>
      <div className="ustbar">
        <div className="marka">
          Sezer<span>itma</span>
        </div>

        <div className="ustbar-orta">
          <span className="etiket vardiya-etiketi">
            Vardiya {vardiya} · Bölüm {String(bolumNo).padStart(2, '0')}
          </span>

          <div
            className="punch"
            role="img"
            aria-label={`${toplamBolum} bölümün ${bolumNo}. bölümündesin`}
          >
            {Array.from({ length: toplamBolum }, (_, i) => (
              <i key={i} data-dolu={i + 1 === bolumNo ? 'simdi' : i + 1 < bolumNo ? '1' : '0'} />
            ))}
          </div>

          <span className="yildiz-sayaci">
            {toplamYildiz}/{enFazlaYildiz}
          </span>

          <button className="harita-dugmesi etiket" onClick={onHaritaAc}>
            Vardiya çizelgesi
          </button>
        </div>
      </div>
      <div className="serit" />
    </header>
  );
}
