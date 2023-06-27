import { defineConfig } from 'vite';
import * as path from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [dts()],
	build: {
		outDir: 'dist/lib',
		lib: {
			entry: path.resolve(__dirname, 'src/lib/index.ts'),
			name: 'BABYLON.VRMLoader',
			fileName: (format) => `index.${format}.js`,
			formats: ['es', 'umd']
		},
		rollupOptions: {
			external: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/loaders/glTF/2.0'],

			output: {
				globals: {
					'@babylonjs/core': 'BABYLON',
					'@babylonjs/loaders': 'LOADERS',
					'@babylonjs/loaders/glTF/2.0': 'LOADERS.GLTF2'
				}
			},
		}
	}
});