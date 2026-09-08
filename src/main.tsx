import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Serbest } from './serbest/Serbest';

/** Serbest mod ayrı bir sayfa değil, aynı uygulamanın #serbest adresi. */
const serbestMi = () => location.hash.startsWith('#serbest');

function Kok() {
  const [serbest, setSerbest] = useState(serbestMi);

  useEffect(() => {
    const dinle = () => setSerbest(serbestMi());
    window.addEventListener('hashchange', dinle);
    return () => window.removeEventListener('hashchange', dinle);
  }, []);

  return serbest ? <Serbest /> : <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Kok />
  </StrictMode>,
);
