import { useEffect, useMemo } from 'react';
import { useOyun, bolumAcik } from './store/oyunStore';
import { BOLUMLER, EN_FAZLA_YILDIZ, TOPLAM_BOLUM } from './levels';
import { Izgara } from './components/sahne/Izgara';
import { DurumSeridi } from './components/sahne/DurumSeridi';
import { KodEditoru } from './components/editor/KodEditoru';
import { Kontroller } from './components/editor/Kontroller';
import { KartModu } from './components/editor/KartModu';
import { TurkceOkuma } from './components/editor/TurkceOkuma';
import { UstBar } from './components/panel/UstBar';
import { GorevKarti } from './components/panel/GorevKarti';
import { KomutListesi } from './components/panel/KomutListesi';
import { IpucuPaneli } from './components/panel/IpucuPaneli';
import { VardiyaSonu } from './components/panel/VardiyaSonu';
import { BolumHaritasi } from './components/panel/BolumHaritasi';
import { DersKarti } from './components/panel/DersKarti';
import { Kavramlar } from './components/panel/Kavramlar';
import { kodluMetin } from './components/panel/metin';
import { dersBul, vardiyaBul } from './content/dersler';
import { adimAnlat } from './content/anlatici';
import type { Durum } from './core/types';

/** Hız kaydırıcısının adım aralıkları. */
const GECIKME = [700, 430, 260, 140, 60];

const kartSatirSayisi = (govde: string) =>
  govde.split(String.fromCharCode(10)).filter((l) => l.trim().length > 0).length;

export default function App() {
  const s = useOyun();
  const { bolum, adimlar, adimIndex, sonuc } = s;

  const ilkDurum: Durum = useMemo(
    () => ({
      kare: bolum.baslangic.kare,
      yon: bolum.baslangic.yon,
      kalanCikolatalar: bolum.cikolatalar,
      cantada: 0,
    }),
    [bolum],
  );

  const suAnkiAdim = adimIndex >= 0 ? adimlar[adimIndex] : undefined;
  const durum = suAnkiAdim?.durum ?? ilkDurum;
  const oynatmaBitti = adimlar.length > 0 && adimIndex >= adimlar.length - 1;

  const iz = useMemo(
    () => adimlar.slice(0, adimIndex + 1).map((a) => a.durum.kare),
    [adimlar, adimIndex],
  );

  const aktif = useMemo(() => {
    if (suAnkiAdim) return { bolme: suAnkiAdim.bolme, satir: suAnkiAdim.satir };
    if (sonuc?.hata && sonuc.hata.satir > 0 && adimlar.length === 0) {
      return { bolme: sonuc.hata.bolme, satir: sonuc.hata.satir };
    }
    return null;
  }, [suAnkiAdim, sonuc, adimlar.length]);

  // oynatma zamanlayıcısı
  useEffect(() => {
    if (!s.oynatiliyor) return;
    const id = setTimeout(s.tik, GECIKME[s.hiz - 1]);
    return () => clearTimeout(id);
  }, [s.oynatiliyor, s.hiz, adimIndex, s.tik, s]);

  // animasyon süresi hıza uysun
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--gecis',
      `${Math.min(220, GECIKME[s.hiz - 1] * 0.7)}ms`,
    );
  }, [s.hiz]);

  // Ctrl+Enter ile çalıştır
  useEffect(() => {
    const dinle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        s.calistirBasla();
      }
    };
    window.addEventListener('keydown', dinle);
    return () => window.removeEventListener('keydown', dinle);
  }, [s]);

  const toplamYildiz = Object.values(s.yildizlar).reduce<number>((a, b) => a + b, 0);
  const hata = sonuc?.hata;

  const ders = dersBul(bolum.no);
  const vardiyaGirisi = [1, 5, 9, 13, 17].includes(bolum.no) ? vardiyaBul(bolum.vardiya) : undefined;
  const anlati = adimAnlat(suAnkiAdim, adimIndex > 0 ? adimlar[adimIndex - 1] : undefined);

  return (
    <div className="uygulama">
      <UstBar
        bolumNo={bolum.no}
        toplamBolum={TOPLAM_BOLUM}
        vardiya={bolum.vardiya}
        toplamYildiz={toplamYildiz}
        enFazlaYildiz={EN_FAZLA_YILDIZ}
        onHaritaAc={() => s.haritaAcKapa(true)}
        onKavramlarAc={() => s.kavramlarAcKapa(true)}
      />

      <main className="tezgah">
        <section className="sahne">
          <GorevKarti
            bolumNo={bolum.no}
            ad={bolum.ad}
            kavram={bolum.kavram}
            gorev={bolum.gorev}
            dersVar={ders !== undefined}
            onDers={s.dersAc}
          />
          <div className="zemin-alani">
            <Izgara bolum={bolum} durum={durum} iz={iz} />
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
          </div>
        </section>

        <section className="kod-paneli">
          <div className="kod-baslik">
            <span className="etiket">main.cpp</span>
            <span className="etiket">
              {sonuc ? `${sonuc.kullanilanSatir} / ${bolum.hedefSatir} satır` : `hedef ${bolum.hedefSatir} satır`}
            </span>
          </div>

          <KodEditoru
            bolum={bolum}
            kod={s.kod}
            aktif={aktif}
            duzenlenebilir={!s.oynatiliyor && !s.kartlaYaz}
            onDegis={s.kodYaz}
          />

          <div className="yazim-secimi">
            {bolum.kartModu && (
              <button
                className="yazim-sekmesi"
                data-secili={s.kartlaYaz && !s.turkceAcik ? '1' : undefined}
                onClick={() => {
                  s.kartlaYazDegistir(true);
                  s.turkceAcKapa(false);
                }}
              >
                Kartlarla diz
              </button>
            )}
            <button
              className="yazim-sekmesi"
              data-secili={!s.kartlaYaz && !s.turkceAcik ? '1' : undefined}
              onClick={() => {
                s.kartlaYazDegistir(false);
                s.turkceAcKapa(false);
              }}
            >
              Kendim yazayım
            </button>
            <button
              className="yazim-sekmesi"
              data-secili={s.turkceAcik ? '1' : undefined}
              onClick={() => s.turkceAcKapa(!s.turkceAcik)}
            >
              Türkçe oku
            </button>
          </div>

          {s.turkceAcik && <TurkceOkuma kod={s.kod} />}

          {bolum.kartModu && s.kartlaYaz && !s.turkceAcik && (
            <KartModu
              izinliKomutlar={bolum.izinliKomutlar}
              satirSayisi={kartSatirSayisi(s.kod.govde)}
              onEkle={s.kartEkle}
              onGeriAl={s.kartGeriAl}
              onTemizle={s.kartTemizle}
            />
          )}

          <Kontroller
            oynatiliyor={s.oynatiliyor}
            calisti={adimlar.length > 0 || sonuc !== null}
            hiz={s.hiz}
            onCalistir={s.calistirBasla}
            onDuraklat={s.duraklat}
            onDevam={s.devamEt}
            onAdim={s.ileriAl}
            onSifirla={s.sifirla}
            onHiz={(hiz) => useOyun.setState({ hiz })}
          />

          {hata && (oynatmaBitti || adimlar.length === 0) && (
            <p className="rapor rapor-hata" role="status">
              {kodluMetin(hata.mesaj)}
            </p>
          )}
          {sonuc?.basarili && oynatmaBitti && !s.basariAcik && (
            <p className="rapor rapor-iyi" role="status">
              Vardiya tamam. {sonuc.kullanilanSatir} satır kullandın.
            </p>
          )}

          <div className="alt-panel">
            <KomutListesi
              izinliKomutlar={bolum.izinliKomutlar}
              izinliYapilar={bolum.izinliYapilar}
            />
            <IpucuPaneli ipuclari={bolum.ipuclari} acikSayisi={s.ipucuAcik} onAc={s.ipucuAc} />
          </div>
        </section>
      </main>

      {s.basariAcik && sonuc?.basarili && (
        <VardiyaSonu
          bolumNo={bolum.no}
          ad={bolum.ad}
          yildiz={sonuc.yildiz as 1 | 2 | 3}
          kullanilanSatir={sonuc.kullanilanSatir}
          hedefSatir={bolum.hedefSatir}
          vardiyaNotu={bolum.vardiyaNotu}
          cantada={durum.cantada}
          sonBolumMu={bolum.no >= TOPLAM_BOLUM}
          onSonraki={s.sonrakiBolum}
          onTekrar={() => {
            s.basariKapat();
            s.sifirla();
          }}
        />
      )}

      {s.dersAcik && (
        <DersKarti
          ders={ders}
          vardiya={vardiyaGirisi}
          onKapat={s.dersKapat}
          onKavramlar={() => {
            s.dersKapat();
            s.kavramlarAcKapa(true);
          }}
        />
      )}

      {s.kavramlarAcik && (
        <Kavramlar bolumNo={bolum.no} onKapat={() => s.kavramlarAcKapa(false)} />
      )}

      {s.haritaAcik && (
        <BolumHaritasi
          bolumler={BOLUMLER.map((b) => ({
            no: b.no,
            yildiz: s.yildizlar[b.no] ?? 0,
            acik: bolumAcik(b.no, s.yildizlar),
          }))}
          suAnki={bolum.no}
          onSec={s.bolumSec}
          onKapat={() => s.haritaAcKapa(false)}
        />
      )}
    </div>
  );
}
