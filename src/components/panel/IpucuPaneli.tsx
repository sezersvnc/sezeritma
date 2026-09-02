import type { IpucuPaneliProps } from '../../core/types';
import { kodluMetin } from './metin';

export function IpucuPaneli({ ipuclari, acikSayisi, onAc }: IpucuPaneliProps) {
  return (
    <section>
      {ipuclari.slice(0, acikSayisi).map((ipucu, i) => (
        <p key={i} className="ipucu">
          {kodluMetin(ipucu)}
        </p>
      ))}

      {acikSayisi < 2 && (
        <button className="ipucu-dugmesi etiket" onClick={onAc}>
          {acikSayisi === 0 ? 'İpucu ver — bir yıldıza mal olur' : 'Hâlâ takıldım, daha fazlasını göster'}
        </button>
      )}
    </section>
  );
}
