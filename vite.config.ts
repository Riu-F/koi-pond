import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served under riufukazawa.com/koi-pond/ via a rewrite from the portfolio.
  // vercel.json maps this prefix back to the root for the standalone deploy.
  base: '/koi-pond/',
  plugins: [react()],
})
