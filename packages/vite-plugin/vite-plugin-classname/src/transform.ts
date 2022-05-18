import * as cssTree from 'css-tree';

/**
 * transform CSS
 * @param code
 * @param prefixClassName
 */
export const transformCSS = (prefixClassName: string, code: string): string => {
  const ast = cssTree.parse(code);
  cssTree.walk(ast, (node) => {
    if (node.type === 'ClassSelector') {
      node.name = `${prefixClassName}-${node.name}`;
    }
  });
  return cssTree.generate(ast);
};

/**
 * transform TSX of className
 * @param prefixClassName
 * @param code
 */
export const transformTSX = (prefixClassName: string, code: string) => {
  const classNameRegex = /className:\s["'`](.*)["'`]/g;
  return code.replace(classNameRegex, (match, className) => {
    return `className: "${prefixClassName}-${className}"`;
  });
};
