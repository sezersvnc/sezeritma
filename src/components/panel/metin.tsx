import { Fragment, type ReactNode } from 'react';

/** Metindeki `ters tırnaklı` parçaları kod olarak gösterir. */
export function kodluMetin(metin: string): ReactNode {
  return metin.split(/`([^`]+)`/g).map((parca, i) =>
    i % 2 === 1 ? <code key={i}>{parca}</code> : <Fragment key={i}>{parca}</Fragment>,
  );
}
