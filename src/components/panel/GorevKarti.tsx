import type { GorevKartiProps } from '../../core/types';

export function GorevKarti({ bolumNo, ad, kavram, gorev }: GorevKartiProps) {
  return (
    <section className="gorev-karti">
      <span className="etiket no">Bölüm {String(bolumNo).padStart(2, '0')}</span>
      <h1>{ad}</h1>
      <p>{gorev}</p>
      <p className="kavram">Bu bölümde öğrendiğin: <b>{kavram}</b></p>
    </section>
  );
}
