import { useEffect, useRef } from 'react';

/**
 * Açık bir pencere varken Tab tuşu pencerenin dışına çıkmamalı.
 *
 * Fare kullanan biri bunu fark etmez ama klavyeyle gezen biri, pencere
 * açıkken arkadaki editöre geçtiğinde nerede olduğunu kaybeder. Pencere
 * kapanınca odak, pencereyi açan düğmeye geri döner.
 */
const ODAKLANABILIR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useOdakTuzagi<T extends HTMLElement>() {
  const kap = useRef<T>(null);

  useEffect(() => {
    const oncekiOdak = document.activeElement as HTMLElement | null;

    const dinle = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !kap.current) return;
      const ogeler = [...kap.current.querySelectorAll<HTMLElement>(ODAKLANABILIR)].filter(
        (o) => !o.hasAttribute('disabled') && o.offsetParent !== null,
      );
      if (ogeler.length === 0) return;

      const ilk = ogeler[0];
      const son = ogeler[ogeler.length - 1];
      const simdi = document.activeElement;

      if (!kap.current.contains(simdi)) {
        e.preventDefault();
        ilk.focus();
      } else if (e.shiftKey && simdi === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && simdi === son) {
        e.preventDefault();
        ilk.focus();
      }
    };

    window.addEventListener('keydown', dinle);
    return () => {
      window.removeEventListener('keydown', dinle);
      oncekiOdak?.focus?.();
    };
  }, []);

  return kap;
}
