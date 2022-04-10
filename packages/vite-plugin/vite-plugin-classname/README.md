# vite-plugin-classname

A quick plugin to register className prefixes, this eliminates the need for component library authors to define an additional prefix variable in both the JS and CSS sections.

It is better to prevent class name conflicts in your component library

## Install

```shell
$ pnpm add vite-plugin-classname -D
```

```tsx
// vite.config.ts
import { defineConfig } from 'vite';
import { VitePluginClassName } from 'vite-plugin-classname';

export default defineConfig({
  plugins: [
    VitePluginClassName({ prefixClassName: 'demo' })
  ]
})
```

## Usage

> It will process CSS files by default
>
> If you use CSS preprocessors, you'll need to configure them a little extra

### Set the prefix class name

```tsx
VitePluginClassName({ 
  prefixClassName: 'demo', 
})
```

### Use sass

```tsx
VitePluginClassName({ 
  prefixClassName: 'demo', 
  cssSuffix: ['.sass']
})
```

### Use scss

```tsx
VitePluginClassName({ 
  prefixClassName: 'demo', 
  cssSuffix: ['.scss']
})
```

### Use less

```tsx
VitePluginClassName({ 
  prefixClassName: 'demo', 
  cssSuffix: ['.less']
})
```

### Use styl

```tsx
VitePluginClassName({ 
  prefixClassName: 'demo', 
  cssSuffix: ['.styl']
})
```

