# vite-plugin-friendly-type-imports

reference：https://github.com/fwouts/rollup-plugin-friendly-type-imports

This plugin is primarily intended for Vite users who want to use TypeScript without being forced to set isolatedModules: true in their tsconfig.json.

It's also a valid Rollup plugin, and as such may be used in other, similar situations.

## Usage

```bash
pnpm add vite-plugin-friendly-type-imports -D
```

```ts
// vite.config.ts
import { friendlyTypeImports } from 'vite-plugin-friendly-type-imports';

export default defineConfig({
	plugins: [
		friendlyTypeImports()
	]
});
```

