import { useEffect, useRef, useState } from 'react';
import { DersDemo } from './DersDemo';
import type { Demo } from '../../content/dersler';
import { useOdakTuzagi } from './odakTuzagi';

/**
 * Karşılama.
 *
 * Oyunu ilk kez açan biri için. Sağ ok ile ilerleyen kısa sayfalar:
 * bu nedir, algoritma nedir, ekran nasıl çalışır, nasıl başlanır.
 * Bir kere gösterilir, sonra bir daha çıkmaz.
 */

const TANITIM_DEMO: Demo = {
  harita: ['#######', '#S.C.M#', '#######'],
  yon: 'dogu',
  kod: 'ilerle();\nilerle();\nkap();\nilerle();',
  anlat: 'Dört satır kod, dört hareket. Yazdığın her satır ekranda karşılığını buluyor.',
};

interface Sayfa {
  etiket: string;
  baslik: string;
  paragraflar: string[];
  maddeler?: string[];
  demo?: Demo;
  /** Son sayfada giriş seviyesi sorulur. */
  seviyeSecimi?: boolean;
}

const SAYFALAR: Sayfa[] = [
  {
    etiket: '',
    baslik: 'Sezeritma',
    paragraflar: [
      'Burada kod yazarak bir fabrikada çalışan stajyer Sezer\'i yönetiyorsun.',
      'Amaç oyunu bitirmek değil. Amaç, oyunu bitirdiğinde algoritmanın ne olduğunu anlamış olman.',
    ],
    maddeler: [
      'Hiç kod yazmadıysan doğru yerdesin.',
      'İlk bölümlerde tek satır bile yazmayacaksın.',
      'Yazdığın her şey gerçek C++ olacak.',
    ],
  },
  {
    etiket: 'Temel fikir',
    baslik: 'Algoritma zaten bildiğin bir şey',
    paragraflar: [
      'Birine çay yapmayı tarif ettiğini düşün. Suyu koy, kaynat, demle, bekle.',
      'Sırayı bozarsan çay olmaz. Bir adımı atlarsan yine olmaz.',
      'Algoritma budur: sırası önemli, eksiksiz adımlar. Bilgisayara iş anlatmak da böyledir.',
    ],
  },
  {
    etiket: 'Ekran',
    baslik: 'Solda depo, sağda kod',
    paragraflar: [
      'Solda Sezer\'in içinde yürüdüğü depoyu görüyorsun. Sağda kodunu yazıyorsun.',
      'Çalıştır dediğinde kod satır satır işleniyor ve Sezer aynı anda hareket ediyor.',
    ],
    maddeler: [
      'Turuncu kare Sezer. Ok, baktığı yönü gösterir.',
      'Koyu kareler palet. Geçilmez.',
      'Kahverengi kareler çikolata. Toplanacak.',
      'Sarı çerçeveli kare mola odası. Hedef.',
    ],
    demo: TANITIM_DEMO,
  },
  {
    etiket: 'Nasıl öğreneceksin',
    baslik: 'Öğren, izle, uygula',
    paragraflar: [
      'Her yeni kavramda önce kısa bir anlatım çıkar.',
      'Sonra o kavramın çalışmasını izlersin.',
      'Sonra sıra sana gelir ve bölümü kendin çözersin.',
    ],
    maddeler: [
      'Takılırsan iki kademeli ipucu var.',
      'Unuttuğun kavramı üst bardaki Kavramlar bölümünden bulursun.',
      'Kodunun Türkçesini görmek için Türkçe oku sekmesine bas.',
    ],
  },
  {
    etiket: 'Başlıyoruz',
    baslik: 'İlk bölümde yazman gerekmiyor',
    paragraflar: [
      'İlk altı bölümde klavyeye dokunmayacaksın. Komut kartlarına basacaksın.',
      'Satırlar senin yerine yazılacak, sen sadece sıraya karar vereceksin.',
      'Yani ilk günden itibaren asıl işi, yani algoritmayı kuracaksın.',
    ],
  },
  {
    etiket: 'Son soru',
    baslik: 'Nereden başlayalım?',
    paragraflar: [
      'Yanlış cevap yok. Seçtiğin yerden ileriye kadar bütün bölümler açılır, geri dönmek de serbest.',
    ],
    seviyeSecimi: true,
  },
];

/** Giriş seviyeleri. Kod bilen biri baştan başlamak zorunda kalmasın diye. */
const SEVIYELER = [
  {
    bolum: 1,
    baslik: 'Hiç kod yazmadım',
    ne: 'Baştan başlarsın. İlk bölümlerde yazmadan, kartlarla ilerlersin.',
  },
  {
    bolum: 7,
    baslik: 'Komut ve sıra biliyorum',
    ne: 'Döngülerden başlarsın. Tekrarı bilgisayara devretmeyi öğreneceksin.',
  },
  {
    bolum: 17,
    baslik: 'Döngü ve koşul biliyorum',
    ne: 'Değişkenlerden başlarsın. Fonksiyon ve özyineleme de burada.',
  },
];

export function Karsilama({ onBitir }: { onBitir: (baslangicBolumu?: number) => void }) {
  const kap = useOdakTuzagi<HTMLDivElement>();
  const [i, setI] = useState(0);
  const [seviye, setSeviye] = useState(1);
  const odak = useRef<HTMLButtonElement>(null);
  const sayfa = SAYFALAR[i];
  const son = i === SAYFALAR.length - 1;

  useEffect(() => odak.current?.focus(), [i]);
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !son) setI((n) => n + 1);
      if (e.key === 'ArrowLeft' && i > 0) setI((n) => n - 1);
    };
    window.addEventListener('keydown', dinle);
    return () => window.removeEventListener('keydown', dinle);
  }, [i, son]);

  return (
    <div className="orti karsilama-orti" ref={kap} role="dialog" aria-modal="true" aria-label="Karşılama">
      <div className="tabela ders-tabelasi">
        <div className="serit" />
        <div className="tabela-ic ders-ic">
          {sayfa.etiket && (
            <span className="etiket" style={{ color: 'var(--beton-4)' }}>
              {sayfa.etiket}
            </span>
          )}
          <h2>{sayfa.baslik}</h2>

          {sayfa.paragraflar.map((p, n) => (
            <p key={n} className="ders-giris">
              {p}
            </p>
          ))}

          {sayfa.maddeler && (
            <ul className="ders-maddeler">
              {sayfa.maddeler.map((m, n) => (
                <li key={n}>{m}</li>
              ))}
            </ul>
          )}

          {sayfa.demo && <DersDemo demo={sayfa.demo} />}

          {sayfa.seviyeSecimi && (
            <div className="seviye-secimi">
              {SEVIYELER.map((sv) => (
                <button
                  key={sv.bolum}
                  className="seviye"
                  data-secili={seviye === sv.bolum ? '1' : undefined}
                  aria-pressed={seviye === sv.bolum}
                  onClick={() => setSeviye(sv.bolum)}
                >
                  <strong>{sv.baslik}</strong>
                  <span>{sv.ne}</span>
                </button>
              ))}
            </div>
          )}

          <div className="ders-gezinme">
            <div className="ders-noktalar" aria-hidden="true">
              {SAYFALAR.map((_, n) => (
                <i key={n} data-dolu={n <= i ? '1' : undefined} />
              ))}
            </div>

            {i > 0 && (
              <button className="dugme-cizgili etiket" onClick={() => setI((n) => n - 1)}>
                Geri
              </button>
            )}
            <button className="dugme-cizgili etiket" onClick={() => onBitir(seviye)}>
              Geç
            </button>

            <button
              ref={odak}
              className="dugme-koyu etiket ileri"
              onClick={() => (son ? onBitir(seviye) : setI((n) => n + 1))}
            >
              {son ? 'Başla' : 'Devam'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
