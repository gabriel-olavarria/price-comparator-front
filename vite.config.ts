import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: {
    port: 5173,
    strictPort: true,
  },

  envDir: mode === 'production'
      ? './overlays/production'
      : './overlays/local',
}))