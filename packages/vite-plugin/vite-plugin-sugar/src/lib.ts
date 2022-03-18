import * as babel from '@babel/core';
import generate, { GeneratorResult } from '@babel/generator';
import { polyfillUndeclaredVariable } from './polyfill';
import { TraverseOptions } from '@babel/traverse'

const commonJSRegex: RegExp = /\b(module\.exports|exports\.\w+|exports\s*=\s*)/;
const requireRegex: RegExp = /_{0,2}require\s*\(\s*(["'].*?["'])\s*\)/g;
const IMPORT_STRING_PREFIX: String = '__require_for_vite';
const multilineCommentsRegex = /\/\*(.|[\r\n])*?\*\//gm;
const singleCommentsRegex = /\/\/.*/g;

export interface TransformRequireResult {
  code: string;
  replaced: boolean;
}

/**
 * cjs => esm
 * @param code
 * @param id
 */
export function transformRequire(code: string, id: string): TransformRequireResult {
  let replaced = false;
  // skip if has no require
  if (!/require/.test(code)) {
    return {
      replaced,
      code
    };
  }
  // empty multiline comments
  code = code.replace(multilineCommentsRegex, '/* */');
  // remove singleline comments
  code = code.replace(singleCommentsRegex, ' ');

  const requireMatches = code.matchAll(requireRegex);
  let importsString = '';
  let packageName = '';
  for (let item of requireMatches) {
    if (!isString(item[1])) {
      console.warn(`Not supported dynamic import, file:${id}`);
      continue;
    }
    replaced = true;
    packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`;
    importsString += `import * as ${packageName} from ${item[1]};\n`;
    code = code.replace(item[0], `${packageName}.default || ${packageName}`);
  }

  if (replaced) {
    code = importsString + code;
  }
  return {
    replaced,
    code
  };
}

export function isCommonJS(code: string): boolean {
  return commonJSRegex.test(code);
}

function randomString(length: number): string {
  const code: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result: string = '';
  for (let index = 0; index < length; index++) {
    result += code[Math.floor(Math.random() * code.length)];
  }
  return result;
}

function isString(text: string) {
  try {
    return typeof eval(text) === 'string';
  } catch (err) {
    return false;
  }
}

/**
 * babel.traverse
 */
const visitor: TraverseOptions = {
  enter(path: babel.NodePath<babel.types.Node>) {
    /**
     * 填充未声明的变量对其进行声明
     */
    polyfillUndeclaredVariable(path);
  }
};

/**
 * babel
 * 代码转换 => 解析成 ast => 遍历 ast 树 => 再建并生成处理后的代码
 * 对未声明的变量进行声明
 */
export function transformUndeclaredVariables(code: string): GeneratorResult {
  const result = babel.transform(code);
  if (!result || !result.code) {
    throw Error(`babel.transform error, result: ${result}`);
  }
  const ast = babel.parse(result.code);
  if (!ast) {
    throw Error(`ast error: ${ast}`);
  }
  babel.traverse(ast, visitor);
  return generate(ast);
}