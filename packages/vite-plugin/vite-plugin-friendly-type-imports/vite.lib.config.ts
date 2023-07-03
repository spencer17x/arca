import { defineConfig } from 'vite';
import * as path from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [dts()],
	build: {
		outDir: 'dist/lib',
		lib: {
			entry: path.resolve(__dirname, 'plugin/index.ts'),
			name: 'vite-plugin-friendly-type-imports',
			fileName: (format) => `index.${format}.js`,
			formats: ['es', 'cjs']
		}
	}
});
