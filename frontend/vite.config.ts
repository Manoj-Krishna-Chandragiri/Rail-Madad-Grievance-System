import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5151
  },
  build: {
    outDir: 'build', // Ensure this matches the directory specified in amplify.yml
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});