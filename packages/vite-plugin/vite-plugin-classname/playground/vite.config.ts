import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// @ts-ignore
import { VitePluginClassName } from '../src';

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
