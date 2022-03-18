import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import camelCase from 'lodash.camelcase';
import { uglify } from 'rollup-plugin-uglify';
import replace from '@rollup/plugin-replace';

const pkg = require('./package.json');
const buildEnvironment = process.env.NODE_ENV;
console.log('buildEnvironment', buildEnvironment);
const isProd = buildEnvironment === 'prod';
const sourcemap = !isProd;
const libraryName = 'index';
const outputLibraryName = camelCase(libraryName);

export default {
  input: `src/${libraryName}.ts`,
  output: [
    {
      file: pkg.main,
      name: outputLibraryName,
      format: 'cjs',
      sourcemap,
      exports: 'auto'
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap,
      name: outputLibraryName,
      exports: 'auto'
    }
  ],
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    replace({
      preventAssignment: true
    }),
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    nodeResolve(),
    uglify()
  ]
};