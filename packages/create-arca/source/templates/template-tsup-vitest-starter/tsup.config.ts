import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    clean: true,
    format: ['cjs', 'esm', 'iife'],
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: `.${format}.js`,
      };
    }
  },
  // Emit declaration files only
  {
    entry: ['src/index.ts'],
    clean: true,
    dts: {
      only: true
    },
    outDir: 'dist/types',
  },
]);
