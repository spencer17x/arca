import babel, { NodePath } from '@babel/core';

/**
 * 打印 path 信息
 * @param path
 */
export function logPathInfo(path: NodePath<babel.types.Node>) {
  console.log('当前路径类型', path.type); // 打印当前路径类型
  console.log('当前路径源码：', path.toString()); // 打印当前路径所对应的源代码
  // is + 节点类型全名, 能判断当前路径节点的类型是否是声明的类型
  console.log('这是一个变量声明节点:\t', path.isVariableDeclaration());
  console.log('--------------------');
}