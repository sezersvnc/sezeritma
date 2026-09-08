import { useEffect, useRef, useState } from 'react';
import { DERSLER } from '../../content/dersler';
import { kodluMetin } from './metin';

/**
 * Bitiş.
 *
 * Bütün bölümler geçildiğinde çıkar. Amacı tebrik etmek değil, öğrencinin
 * ne öğrendiğini toparlamak ve bundan sonra nereye gideceğini söylemek.
 * Otuz iki bölüm boyunca öğrenilenler dört fikre indirgenir.
 */

interface Props {
  toplamYildiz: number;
  enFazlaYildiz: number;
  toplamBolum: number;
  onKapat: () => void;
}

const DORT_FIKIR = [
  { ad: 'Sıra', ne: 'Komutlar yazdığın düzende çalışır.' },
  { ad: 'Tekrar', ne: '`for` ve `while` aynı işi defalarca yapar.' },
  { ad: 'Karar', ne: '`if` ve `else` duruma göre yol ayırır.' },
  { ad: 'İsimlendirme', ne: 'Değişkenler bilgiye, fonksiyonlar davranışa isim verir.' },
];

export function Bitis({ toplamYildiz, enFazlaYildiz, toplamBolum, onKapat }: Props) {
  const [sayfa, setSayfa] = useState(0);
  const odak = useRef<HTMLButtonElement>(null);
  const son = sayfa === 1;

  useEffect(() => odak.current?.focus(), [sayfa]);

  return (
    <div className="orti karsilama-orti" role="dialog" aria-modal="true" aria-label="Vardiya bitti">
      <div className="tabela ders-tabelasi">
        <div className="serit" />
        <div className="tabela-ic ders-ic">
          {sayfa === 0 ? (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Vardiya bitti
              </span>
              <h2>Sezer paydos kartını bastı</h2>

              <p className="ders-giris">
                {toplamBolum} bölümün hepsini geçtin. Ama asıl mesele bu değil. Otuz iki bölüm
                boyunca öğrendiğin her şey aslında dört fikirdi.
              </p>

              <div className="bitis-fikirler">
                {DORT_FIKIR.map((f) => (
                  <div key={f.ad} className="bitis-fikir">
                    <strong>{f.ad}</strong>
                    <span>{kodluMetin(f.ne)}</span>
                  </div>
                ))}
              </div>

              <p className="ders-giris">
                Hangi programlama dilini öğrenirsen öğren aynı dördünü göreceksin. Sözdizimi
                değişir, bu dört fikir değişmez.
              </p>

              <div className="bitis-olcumler">
                <dl className="olcek">
                  <dt className="etiket">Yıldız</dt>
                  <dd>
                    {toplamYildiz}
                    <span style={{ color: 'var(--beton-4)' }}>/{enFazlaYildiz}</span>
                  </dd>
                </dl>
                <dl className="olcek">
                  <dt className="etiket">Öğrenilen kavram</dt>
                  <dd>{DERSLER.length}</dd>
                </dl>
              </div>
            </section>
          ) : (
            <section>
              <span className="etiket" style={{ color: 'var(--beton-4)' }}>
                Bundan sonra
              </span>
              <h2>Nereye gidebilirsin</h2>

              <ul className="ders-maddeler">
                <li>
                  <b>Serbest harita.</b> Kendi labirentini çiz, kendi problemini kur, bağlantıyı bir
                  arkadaşına gönder. Yıldız yok, doğru cevabı sen belirliyorsun.
                </li>
                <li>
                  <b>Üç yıldız toplamadığın bölümler.</b> Vardiya çizelgesine bak. Aynı bölümü daha
                  az satırla çözmek, yeni bölüm çözmekten daha çok şey öğretir.
                </li>
                <li>
                  <b>Gerçek C++.</b> Burada yazdığın her şey gerçek C++ idi. Eksik olan tek şey
                  `cout` ile ekrana yazmak ve dosyayı derlemek. İkisi de bir akşamda öğrenilir.
                </li>
                <li>
                  <b>Kendi problemin.</b> Aklına takılan bir işi adım adım yazmayı dene. Algoritma
                  kurmak, kod yazmayı bilmekten önce gelir.
                </li>
              </ul>

              <p className="ders-hatirla">
                <span className="etiket">Aklında kalsın</span>
                Programlamayı bilmek, bilgisayara ne yapacağını sırayla ve eksiksiz anlatabilmektir.
                Gerisi ayrıntıdır.
              </p>
            </section>
          )}

          <div className="ders-gezinme">
            <div className="ders-noktalar" aria-hidden="true">
              {[0, 1].map((n) => (
                <i key={n} data-dolu={n <= sayfa ? '1' : undefined} />
              ))}
            </div>

            {sayfa > 0 && (
              <button className="dugme-cizgili etiket" onClick={() => setSayfa(0)}>
                Geri
              </button>
            )}
            <a className="dugme-cizgili etiket" href="#serbest">
              Serbest harita
            </a>
            <button
              ref={odak}
              className="dugme-koyu etiket ileri"
              onClick={() => (son ? onKapat() : setSayfa(1))}
            >
              {son ? 'Çizelgeye dön' : 'Devam'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
