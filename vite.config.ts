import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// `npm test` sadece yayındaki bölümleri denetler.
// `npm run bolum:gelen` ise docs/bolumler altındaki taslakları denetler;
// oradaki bölümler henüz çalışmıyor olabilir, bu yüzden varsayılan koşuya girmez.
const gelenKosusu = process.env.npm_lifecycle_event === 'bolum:gelen'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.kontrol.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      ...(gelenKosusu ? [] : ['**/*.kontrol.ts']),
    ],
  },
})
