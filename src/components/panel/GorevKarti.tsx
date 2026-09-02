import type { GorevKartiProps } from '../../core/types';

interface Props extends GorevKartiProps {
  dersVar: boolean;
  onDers: () => void;
}

export function GorevKarti({ bolumNo, ad, kavram, gorev, dersVar, onDers }: Props) {
  return (
    <section className="gorev-karti">
      <span className="etiket no">Bölüm {String(bolumNo).padStart(2, '0')}</span>
      <h1>{ad}</h1>
      <p>{gorev}</p>
      <p className="kavram">
        Bu bölümde öğrendiğin: <b>{kavram}</b>
        {dersVar && (
          <button className="ders-baglantisi" onClick={onDers}>
            anlatımı aç
          </button>
        )}
      </p>
    </section>
  );
}
