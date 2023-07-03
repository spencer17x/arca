import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fakeExportedTypesPlugin } from './plugin';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: 'dist/example',
	},
	plugins: [react(), fakeExportedTypesPlugin()],
});
