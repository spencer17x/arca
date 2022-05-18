import { PluginOption } from 'vite';

import { transformCSS, transformTSX } from './transform';

export type CssSuffix = '.less' | '.sass' | '.scss' | '.styl' | '.css';

export interface Options {
  prefixClassName: string;
  cssSuffix?: CssSuffix[];
}

export function VitePluginClassName(options: Options): PluginOption {
  return {
    name: 'vite-plugin-classname',
    transform(code: string, id: string) {
      const { cssSuffix = ['.css'], prefixClassName } = options;
      if (cssSuffix.some(suffix => id.endsWith(suffix))) {
        return {
          code: transformCSS(prefixClassName, code)
        };
      }
      if (id.endsWith('.tsx')) {
        console.log('code', code);
        return {
          code: transformTSX(prefixClassName, code)
        };
      }
    }
  };
}
