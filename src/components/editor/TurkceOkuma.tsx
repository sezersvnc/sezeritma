import { useMemo } from 'react';
import { turkceyeCevir } from '../../content/turkceCevir';
import type { Kod } from '../../core/types';

/**
 * Öğrencinin kendi kodunu Türkçe okur. Kod yazmayı yeni öğrenen biri için
 * en zor şey, yazdığı şeyin ne anlama geldiğini görmek. Bu panel tam olarak
 * onu gösteriyor: aynı program, kendi dilinde.
 */
export function TurkceOkuma({ kod }: { kod: Kod }) {
  const okuma = useMemo(() => turkceyeCevir(kod), [kod]);

  return (
    <section className="turkce-okuma">
      <p className="kart-aciklama">
        Yukarıda yazdığın programın Türkçesi. Kod ile anlamı yan yana görünce
        sözdizimi ezberlenmesi gereken bir şey olmaktan çıkıyor.
      </p>

      {okuma.hata ? (
        <p className="turkce-uyari">{okuma.hata}</p>
      ) : (
        <ol className="turkce-satirlar">
          {okuma.satirlar.map((satir, i) =>
            satir.metin ? (
              <li key={i} style={{ paddingLeft: `${satir.girinti * 20}px` }}>
                {satir.metin}
              </li>
            ) : (
              <li key={i} className="turkce-bosluk" />
            ),
          )}
        </ol>
      )}
    </section>
  );
}
