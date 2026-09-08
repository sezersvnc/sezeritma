import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EN_BUYUK,
  EN_KUCUK,
  bolumUret,
  bosIzgara,
  hucreBoya,
  paylasimKodu,
  paylasimiCoz,
  rastgeleLabirent,
  yenidenBoyutlandir,
  type Hucre,
  type Tasarim,
} from './harita';
import { calistir } from '../core/yurutucu';
import { Izgara } from '../components/sahne/Izgara';
import { DurumSeridi } from '../components/sahne/DurumSeridi';
import { KodEditoru } from '../components/editor/KodEditoru';
import { Kontroller } from '../components/editor/Kontroller';
import { TurkceOkuma } from '../components/editor/TurkceOkuma';
import { kodluMetin } from '../components/panel/metin';
import { adimAnlat } from '../content/anlatici';
import type { Adim, Durum, Kod, Yon } from '../core/types';

/**
 * Serbest mod.
 *
 * Bölümler bir müfredat izler; burası izlemez. Kendi haritanı çizer,
 * istediğin kodu yazar, aynı motorda çalıştırırsın. Kurduğun problem
 * bağlantıya sığdığı için bir arkadaşına gönderip "bunu çözebilir misin"
 * diye sorabilirsin.
 */

const GECIKME = [700, 430, 260, 140, 60];
const KAYIT = 'sezeritma.serbest.v1';

const FIRCALAR: { hucre: Hucre; ad: string; ipucu: string }[] = [
  { hucre: '#', ad: 'Palet', ipucu: 'Geçilmez duvar' },
  { hucre: '.', ad: 'Zemin', ipucu: 'Boş kare' },
  { hucre: 'C', ad: 'Çikolata', ipucu: 'Toplanacak' },
  { hucre: 'S', ad: 'Sezer', ipucu: 'Başlangıç' },
  { hucre: 'M', ad: 'Mola odası', ipucu: 'Hedef' },
];

const YONLER: { deger: Yon; ad: string }[] = [
  { deger: 'kuzey', ad: 'Yukarı' },
  { deger: 'dogu', ad: 'Sağa' },
  { deger: 'guney', ad: 'Aşağı' },
  { deger: 'bati', ad: 'Sola' },
];

const varsayilan = (): { tasarim: Tasarim; kod: Kod } => {
  let h = bosIzgara(9, 7);
  h = hucreBoya(h, 1, 3, 'S');
  h = hucreBoya(h, 4, 3, 'C');
  h = hucreBoya(h, 7, 3, 'M');
  return {
    tasarim: { hucreler: h, yon: 'dogu' },
    kod: { govde: '', fonksiyonlar: '' },
  };
};

const baslangicDurumu = (kaydedilen: string | null): { tasarim: Tasarim; kod: Kod } => {
  const bagKodu = location.hash.startsWith('#serbest=') ? location.hash.slice(9) : '';
  const paylasilan = bagKodu ? paylasimiCoz(bagKodu) : null;
  if (paylasilan) return paylasilan;
  if (kaydedilen) {
    const geri = paylasimiCoz(kaydedilen);
    if (geri) return geri;
  }
  return varsayilan();
};

export function Serbest() {
  const [{ tasarim, kod }, setDurum] = useState(() => {
    try {
      return baslangicDurumu(localStorage.getItem(KAYIT));
    } catch {
      return varsayilan();
    }
  });

  const [firca, setFirca] = useState<Hucre>('#');
  const [adimlar, setAdimlar] = useState<readonly Adim[]>([]);
  const [adimIndex, setAdimIndex] = useState(-1);
  const [oynatiliyor, setOynatiliyor] = useState(false);
  const [hiz, setHiz] = useState(3);
  const [sonuc, setSonuc] = useState<ReturnType<typeof calistir> | null>(null);
  const [turkceAcik, setTurkceAcik] = useState(false);
  const [bildirim, setBildirim] = useState('');

  const guncelle = useCallback((yeni: Partial<{ tasarim: Tasarim; kod: Kod }>) => {
    setDurum((eski) => {
      const sonrasi = { ...eski, ...yeni };
      try {
        localStorage.setItem(KAYIT, paylasimKodu(sonrasi.tasarim, sonrasi.kod));
      } catch {
        /* gizli sekmede yazamayabiliriz */
      }
      return sonrasi;
    });
    setAdimlar([]);
    setAdimIndex(-1);
    setOynatiliyor(false);
    setSonuc(null);
    setBildirim('');
  }, []);

  const bolum = useMemo(() => {
    try {
      return bolumUret(tasarim, kod);
    } catch {
      return null;
    }
  }, [tasarim, kod]);

  const haritaHatasi = useMemo(() => {
    try {
      bolumUret(tasarim, kod);
      return '';
    } catch (h) {
      return h instanceof Error ? h.message : String(h);
    }
  }, [tasarim, kod]);

  const suAnkiAdim = adimIndex >= 0 ? adimlar[adimIndex] : undefined;

  const ilkDurum: Durum | null = bolum && {
    kare: bolum.baslangic.kare,
    yon: bolum.baslangic.yon,
    kalanCikolatalar: bolum.cikolatalar,
    cantada: 0,
  };
  const durum = suAnkiAdim?.durum ?? ilkDurum;
  const iz = useMemo(
    () => adimlar.slice(0, adimIndex + 1).map((a) => a.durum.kare),
    [adimlar, adimIndex],
  );

  const tik = useCallback(() => {
    setAdimIndex((i) => {
      if (i < adimlar.length - 1) return i + 1;
      setOynatiliyor(false);
      return i;
    });
  }, [adimlar.length]);

  useEffect(() => {
    if (!oynatiliyor) return;
    const id = setTimeout(tik, GECIKME[hiz - 1]);
    return () => clearTimeout(id);
  }, [oynatiliyor, hiz, adimIndex, tik]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--gecis',
      `${Math.min(220, GECIKME[hiz - 1] * 0.7)}ms`,
    );
  }, [hiz]);

  const calistirBasla = () => {
    if (!bolum) return;
    const s = calistir(kod, bolum);
    setSonuc(s);
    setAdimlar(s.adimlar);
    setAdimIndex(-1);
    setOynatiliyor(s.adimlar.length > 0);
  };

  const boya = (x: number, y: number) =>
    guncelle({ tasarim: { ...tasarim, hucreler: hucreBoya(tasarim.hucreler, x, y, firca) } });

  const olcuDegistir = (genislik: number, yukseklik: number) =>
    guncelle({
      tasarim: {
        ...tasarim,
        hucreler: yenidenBoyutlandir(
          tasarim.hucreler,
          Math.min(EN_BUYUK, Math.max(EN_KUCUK, genislik)),
          Math.min(EN_BUYUK, Math.max(EN_KUCUK, yukseklik)),
        ),
      },
    });

  const baglantiyiKopyala = async () => {
    const bag = `${location.origin}${location.pathname}#serbest=${paylasimKodu(tasarim, kod)}`;
    try {
      await navigator.clipboard.writeText(bag);
      setBildirim('Bağlantı kopyalandı. Gönderdiğin kişi haritanı ve kodunu aynen görecek.');
    } catch {
      setBildirim('Tarayıcı kopyalamaya izin vermedi. Adres çubuğundaki bağlantıyı elle alabilirsin.');
    }
  };

  const genislik = tasarim.hucreler[0].length;
  const yukseklik = tasarim.hucreler.length;
  const anlati = adimAnlat(suAnkiAdim, adimIndex > 0 ? adimlar[adimIndex - 1] : undefined);
  const oynatmaBitti = adimlar.length > 0 && adimIndex >= adimlar.length - 1;

  return (
    <div className="uygulama">
      <header>
        <div className="ustbar">
          <div className="marka">
            Serbest<span> harita</span>
          </div>
          <div className="ustbar-orta">
            <button className="harita-dugmesi etiket" onClick={baglantiyiKopyala}>
              Bağlantıyı kopyala
            </button>
            <a className="harita-dugmesi etiket" href="#">
              Bölümlere dön
            </a>
          </div>
        </div>
        <div className="serit" />
      </header>

      <main className="tezgah">
        <section className="sahne">
          <section className="gorev-karti">
            <span className="etiket no">Serbest mod</span>
            <h1>Kendi haritanı kur</h1>
            <p>
              Fırçayı seç, ızgaraya çizerek kendi deponu kur. Bütün komutlar açık, yıldız yok,
              zorunlu çözüm yok. Kurduğun problemi bağlantıyla paylaşabilirsin.
            </p>
          </section>

          <div className="firca-secimi">
            {FIRCALAR.map((f) => (
              <button
                key={f.hucre}
                className="firca"
                data-secili={firca === f.hucre ? '1' : undefined}
                onClick={() => setFirca(f.hucre)}
                title={f.ipucu}
              >
                <span className="firca-ornek" data-hucre={f.hucre} />
                {f.ad}
              </button>
            ))}
          </div>

          <div className="serbest-arac">
            <label className="serbest-alan">
              Genişlik
              <input
                type="number"
                min={EN_KUCUK}
                max={EN_BUYUK}
                value={genislik}
                onChange={(e) => olcuDegistir(Number(e.target.value) || EN_KUCUK, yukseklik)}
              />
            </label>
            <label className="serbest-alan">
              Yükseklik
              <input
                type="number"
                min={EN_KUCUK}
                max={EN_BUYUK}
                value={yukseklik}
                onChange={(e) => olcuDegistir(genislik, Number(e.target.value) || EN_KUCUK)}
              />
            </label>
            <label className="serbest-alan">
              Sezer nereye baksın
              <select
                value={tasarim.yon}
                onChange={(e) => guncelle({ tasarim: { ...tasarim, yon: e.target.value as Yon } })}
              >
                {YONLER.map((y) => (
                  <option key={y.deger} value={y.deger}>
                    {y.ad}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="dugme dugme-acik"
              onClick={() =>
                guncelle({
                  tasarim: { ...tasarim, hucreler: rastgeleLabirent(genislik, yukseklik) },
                })
              }
            >
              Rastgele labirent
            </button>
            <button
              className="dugme dugme-acik"
              onClick={() => guncelle({ tasarim: { ...tasarim, hucreler: bosIzgara(genislik, yukseklik) } })}
            >
              Temizle
            </button>
          </div>

          <div className="zemin-alani">
            {bolum && durum ? (
              <>
                <Izgara
                  bolum={bolum}
                  durum={durum}
                  iz={iz}
                  duzenlenebilir={!oynatiliyor}
                  onHucre={boya}
                />
                <DurumSeridi
                  durum={durum}
                  toplamCikolata={bolum.cikolatalar.length}
                  adimNo={adimIndex + 1}
                  toplamAdim={adimlar.length}
                  degiskenler={suAnkiAdim?.degiskenler ?? {}}
                />
                <p className="anlati" aria-live="polite">
                  {anlati}
                </p>
              </>
            ) : (
              <p className="rapor rapor-hata">{haritaHatasi}</p>
            )}
          </div>
        </section>

        <section className="kod-paneli">
          <div className="kod-baslik">
            <span className="etiket">main.cpp</span>
            <span className="etiket">bütün komutlar açık</span>
          </div>

          {bolum && (
            <KodEditoru
              bolum={bolum}
              kod={kod}
              aktif={
                suAnkiAdim
                  ? { bolme: suAnkiAdim.bolme, satir: suAnkiAdim.satir }
                  : sonuc?.hata && sonuc.hata.satir > 0
                    ? { bolme: sonuc.hata.bolme, satir: sonuc.hata.satir }
                    : null
              }
              duzenlenebilir={!oynatiliyor}
              onDegis={(parca) => guncelle({ kod: { ...kod, ...parca } })}
            />
          )}

          <div className="yazim-secimi">
            <button
              className="yazim-sekmesi"
              data-secili={!turkceAcik ? '1' : undefined}
              onClick={() => setTurkceAcik(false)}
            >
              Kendim yazayım
            </button>
            <button
              className="yazim-sekmesi"
              data-secili={turkceAcik ? '1' : undefined}
              onClick={() => setTurkceAcik(true)}
            >
              Türkçe oku
            </button>
          </div>

          {turkceAcik && <TurkceOkuma kod={kod} />}

          <Kontroller
            oynatiliyor={oynatiliyor}
            calisti={adimlar.length > 0 || sonuc !== null}
            hiz={hiz}
            onCalistir={calistirBasla}
            onDuraklat={() => setOynatiliyor(false)}
            onDevam={() => setOynatiliyor(adimIndex < adimlar.length - 1)}
            onAdim={() => {
              if (!sonuc) {
                calistirBasla();
                setOynatiliyor(false);
                return;
              }
              setAdimIndex((i) => Math.min(i + 1, adimlar.length - 1));
              setOynatiliyor(false);
            }}
            onSifirla={() => {
              setAdimlar([]);
              setAdimIndex(-1);
              setSonuc(null);
              setOynatiliyor(false);
            }}
            onHiz={setHiz}
          />

          {sonuc?.hata && (oynatmaBitti || adimlar.length === 0) && (
            <p className="rapor rapor-hata" role="status">
              {kodluMetin(sonuc.hata.mesaj)}
            </p>
          )}
          {sonuc?.basarili && oynatmaBitti && (
            <p className="rapor rapor-iyi" role="status">
              Harita çözüldü. {sonuc.kullanilanSatir} satır, {adimlar.length} adım.
            </p>
          )}
          {bildirim && (
            <p className="rapor rapor-iyi" role="status">
              {bildirim}
            </p>
          )}

          <div className="alt-panel">
            <p className="kart-aciklama">
              Serbest modda yıldız verilmiyor, çünkü doğru cevabı sen belirliyorsun. Çizdiğin harita
              ve yazdığın kod tarayıcında saklanıyor; sekmeyi kapatsan da yerinde duruyor.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
