import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginClassName } from 'vite-plugin-classname';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginClassName({
      prefixClassName: 'demo',
      cssSuffix: ['.scss']
    })
  ]
});
