interface Props {
  /** Adım adım ve hız, üçüncü bölümde açılır. Öncesinde ekranı kalabalıklaştırır. */
  adimKontrolu: boolean;
  oynatiliyor: boolean;
  calisti: boolean;
  hiz: number;
  onCalistir: () => void;
  onDuraklat: () => void;
  onDevam: () => void;
  onAdim: () => void;
  onSifirla: () => void;
  /** Bölüm hazır kodla başlıyorsa, bozulan kodu geri getirme yolu. */
  onKoduGeriYukle?: () => void;
  onHiz: (hiz: number) => void;
}

export function Kontroller({
  adimKontrolu,
  oynatiliyor,
  calisti,
  hiz,
  onCalistir,
  onDuraklat,
  onDevam,
  onAdim,
  onSifirla,
  onKoduGeriYukle,
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
          <kbd className="etiket kisayol" style={{ opacity: 0.6 }}>
            Ctrl↵
          </kbd>
        </button>
      )}

      {adimKontrolu && (
        <button className="dugme" onClick={onAdim} disabled={oynatiliyor}>
          Adım adım
        </button>
      )}
      <button className="dugme" onClick={onSifirla} disabled={!calisti}>
        Sıfırla
      </button>
      {onKoduGeriYukle && (
        <button className="dugme" onClick={onKoduGeriYukle} disabled={oynatiliyor}>
          Kodu geri yükle
        </button>
      )}

      {adimKontrolu && (
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
      )}
    </div>
  );
}
