function add(...args: number[]): number {
  return args.reduce((total, cur) => {
    return total + cur;
  }, 0)
}

export {
  add
}