# vite-plugin-sugar

The library reference [vite-plugin-commonjs](#https://github.com/originjs/vite-plugins/tree/main/packages/vite-plugin-commonjs)

Polyfill some libraries that are not coded correctly, as follows:

* [x] [lamejs](#https://github.com/zhuker/lamejs)
* [ ] [emoji-picker-react](#https://github.com/ealush/emoji-picker-react)

## Install

```shell
$ npm install vite-plugin-sugar --save-dev
```

or 

```shell
$ yarn add vite-plugin-sugar -D
```

## Usage

```ts
import { vitePluginLibraryPolyfill } from 'vite-plugin-sugar';

// vite.config.ts/vite.config.js
export default {
  plugins: [
    vitePluginLibraryPolyfill({include: ['lamejs']})
  ]
}
```

