interface Props {
  oynatiliyor: boolean;
  calisti: boolean;
  hiz: number;
  onCalistir: () => void;
  onDuraklat: () => void;
  onDevam: () => void;
  onAdim: () => void;
  onSifirla: () => void;
  onHiz: (hiz: number) => void;
}

export function Kontroller({
  oynatiliyor,
  calisti,
  hiz,
  onCalistir,
  onDuraklat,
  onDevam,
  onAdim,
  onSifirla,
  onHiz,
}: Props) {
  return (
    <div className="kontroller">
      {oynatiliyor ? (
        <button className="dugme dugme-birincil" onClick={onDuraklat}>
          Duraklat
        </button>
      ) : (
        <button className="dugme dugme-birincil" onClick={calisti ? onDevam : onCalistir}>
          {calisti ? 'Devam et' : 'Çalıştır'}
          <kbd className="etiket" style={{ opacity: 0.6 }}>
            Ctrl↵
          </kbd>
        </button>
      )}

      <button className="dugme" onClick={onAdim} disabled={oynatiliyor}>
        Adım adım
      </button>
      <button className="dugme" onClick={onSifirla} disabled={!calisti}>
        Sıfırla
      </button>

      <label className="hiz">
        <span className="etiket">Hız</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={hiz}
          onChange={(e) => onHiz(Number(e.target.value))}
          aria-label="Çalıştırma hızı"
        />
      </label>
    </div>
  );
}
