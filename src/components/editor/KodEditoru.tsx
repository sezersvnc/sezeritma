import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { EditorView, Decoration } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import type { Bolme, Bolum, Kod } from '../../core/types';

/**
 * Öğrenci boş sayfaya bakmıyor: iskelet kilitli ve gri, sadece gövde onun.
 * `#include` ve `int main()` görünüyor ki dersinde karşısına çıktığında
 * yabancı gelmesin, ama onları yazmak zorunda değil.
 */

const tema = EditorView.theme(
  {
    '&': { color: '#e9e8e5', fontSize: '13.5px' },
    '.cm-scroller': { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    '.cm-selectionBackground, ::selection': { background: '#333840 !important' },
    '.cm-gutterElement': { color: '#5a5f68' },
  },
  { dark: true },
);

/* Tek aksan: anahtar kelimeler turuncu, gerisi gri tonları.
   Kod okunacak bir metin, renk şöleni değil. */
const renkler = HighlightStyle.define([
  { tag: tags.keyword, color: '#e2571f' },
  { tag: tags.controlKeyword, color: '#e2571f' },
  { tag: tags.number, color: '#e9e8e5' },
  { tag: tags.bool, color: '#e9e8e5' },
  { tag: tags.comment, color: '#6a6f78', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#e9e8e5' },
  { tag: tags.function(tags.variableName), color: '#b9c2cc' },
  { tag: tags.operator, color: '#8a8f98' },
  { tag: tags.punctuation, color: '#6a6f78' },
]);

const aktifSatirEklentisi = (satir: number | null) =>
  EditorView.decorations.compute(['doc'], (state) => {
    if (!satir || satir < 1 || satir > state.doc.lines) return Decoration.none;
    const line = state.doc.line(satir);
    return Decoration.set([Decoration.line({ class: 'cm-aktif-satir' }).range(line.from)]);
  });

interface Props {
  bolum: Bolum;
  kod: Kod;
  aktif: { bolme: Bolme; satir: number } | null;
  duzenlenebilir: boolean;
  onDegis: (parca: Partial<Kod>) => void;
}

export function KodEditoru({ bolum, kod, aktif, duzenlenebilir, onDegis }: Props) {
  const govdeEklentileri = useMemo(
    () => [
      cpp(),
      tema,
      syntaxHighlighting(renkler),
      EditorView.lineWrapping,
      aktifSatirEklentisi(aktif?.bolme === 'govde' ? aktif.satir : null),
    ],
    [aktif],
  );

  const fonksiyonEklentileri = useMemo(
    () => [
      cpp(),
      tema,
      syntaxHighlighting(renkler),
      EditorView.lineWrapping,
      aktifSatirEklentisi(aktif?.bolme === 'fonksiyon' ? aktif.satir : null),
    ],
    [aktif],
  );

  const ortak = {
    basicSetup: {
      lineNumbers: true,
      foldGutter: false,
      highlightActiveLine: false,
      highlightActiveLineGutter: false,
      autocompletion: false,
      searchKeymap: false,
      bracketMatching: true,
      closeBrackets: true,
    },
    editable: duzenlenebilir,
    theme: 'none' as const,
  };

  return (
    <div className="editor-yigin">
      <div className="kilitli-satir">#include &quot;sezeritma.h&quot;</div>

      {bolum.fonksiyonBolmesi && (
        <>
          <div className="kilitli-satir">&nbsp;</div>
          <div className="bolme-etiketi etiket">Kendi komutların</div>
          <CodeMirror
            {...ortak}
            value={kod.fonksiyonlar}
            extensions={fonksiyonEklentileri}
            onChange={(v) => onDegis({ fonksiyonlar: v })}
            placeholder="void basamak() { ... }"
          />
        </>
      )}

      <div className="kilitli-satir">&nbsp;</div>
      <div className="kilitli-satir">int main() {'{'}</div>

      <CodeMirror
        {...ortak}
        value={kod.govde}
        extensions={govdeEklentileri}
        onChange={(v) => onDegis({ govde: v })}
        placeholder="ilerle();"
      />

      <div className="kilitli-satir ic">return 0;</div>
      <div className="kilitli-satir">{'}'}</div>
    </div>
  );
}
