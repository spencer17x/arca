import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import VitePluginSugar from 'vite-plugin-sugar';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePluginSugar({include: ['lamejs']})],
});
