import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: ['es2015', 'safari13', 'chrome80'],
    cssTarget: 'chrome80'
  },
  server: {
    port: 3000,
    host: true
  }
});
