# vite-plugin-mediapipe

## Usage

```bash
pnpm add vite-plugin-mediapipe -D
```

```ts
// vite.config.ts
import { mediapipe } from 'vite-plugin-mediapipe';

// default options
export default defineConfig({
	plugins: [
		mediapipe()
	]
});

// or custom options
export default defineConfig({
	plugins: [
		mediapipe({
			'xxx': [
				'xxx',
				'xxx',
				'xxx',
				'xxx',
			]
		})
	]
});
```

## Supported MediaPipe Modules

- @mediapipe/camera_utils
- @mediapipe/drawing_utils
- @mediapipe/holistic
- @mediapipe/face_detection

If you need support, you can raise an issue or pr, I will deal with it immediately
