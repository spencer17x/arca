function add(...args: number[]) {
  return args.reduce((prev, cur) => prev + cur, 0);
}

export default add