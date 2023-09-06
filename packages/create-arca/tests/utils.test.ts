import { describe, expect, it } from 'vitest';
import { readTemplates } from '../src/utils';

describe('utils', test => {
	it('should work', () => {
		const result = readTemplates();
		expect(result).toEqual([
			'template-esbuild-starter',
			'template-react-components-starter',
			'template-ts-rollup-starter',
			'template-tsup-vitest-starter'
		]);
	});
});
