import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5151
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});