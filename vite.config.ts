import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/dev': {
        target: 'https://n4m5blv5-3600.inc1.devtunnels.ms',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
