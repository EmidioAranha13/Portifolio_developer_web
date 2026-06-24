import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.pdf', '**/*.ppt', '**/*.pptx', '**/*.odp'],
  server: {
    port: 3000,
    open: true,
  }
})
