import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import scss from 'rollup-plugin-scss';
import * as fs from 'fs';

const externalForSrc = [
  'index.ts',
]
const components = fs.readdirSync('src').filter(name => !externalForSrc.includes(name));

const packageJson = require('./package.json');

const libraryName = packageJson.name;

/**
 * plugins
 */
const plugins = [
  peerDepsExternal(),
  nodeResolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: true
  }),
  terser()
];

/**
 * build es module
 */
const esmConfig = components.map(cmp => {
  return {
    input: `src/${cmp}/index.tsx`,
    output: {
      file: `es/${cmp}/index.js`,
      format: 'esm',
      sourcemap: false,
      exports: 'named',
    },
    plugins: plugins.concat([
      scss({
        output: `es/${cmp}/index.css`,
      })
    ])
  };
}).concat({
  input: 'src/index.ts',
  output: {
    file: 'es/index.js',
    format: 'esm',
    sourcemap: false,
    exports: 'named',
  },
  plugins: plugins.concat([
    scss({
      output: 'es/index.css',
    })
  ])
});

/**
 * build cjs module
 */
const cjsConfig = components.map(cmp => {
  return {
    input: `src/${cmp}/index.tsx`,
    output: {
      file: `lib/${cmp}/index.js`,
      format: 'cjs',
      sourcemap: false,
      exports: 'named',
    },
    plugins: plugins.concat([
      scss({
        output: `lib/${cmp}/index.css`,
      })
    ])
  };
}).concat({
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: false,
    exports: 'named',
  },
  plugins: plugins.concat([
    scss({
      output: 'lib/index.css',
    })
  ])
});

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        sourcemap: false,
        name: libraryName,
      }
    ],
    plugins: plugins.concat([
      scss({
        output: 'dist/index.css',
      })
    ])
  },
  ...esmConfig,
  ...cjsConfig
];

export default config;
