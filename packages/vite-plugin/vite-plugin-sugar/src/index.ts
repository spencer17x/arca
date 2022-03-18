import { PluginOption } from 'vite';
import { transformUndeclaredVariables } from './lib';

export type Options = {
	include: string[];
};

/**
 * polyfill some library can not use script module
 * 填充一些库无法正常编译成 script module 使用
 * @param options
 */
export default function VitePluginSugar(
	options: Options,
): PluginOption {
	return {
		name: 'vite-plugin-sugar',
		transform(code: string, id: string) {
			if (options.include.some(library => id.includes(library))) {
				const output = transformUndeclaredVariables(code);
				return {
				  code: output.code,
				  map: output.map,
				};
			}
		},
	};
}
