export const add = (...args: number[]) => {
  if (args.length <= 1) {
    throw new Error('add function requires at least 2 arguments');
  }
  return args.slice(1).reduce(
    (acc, curr) => acc + curr,
    args[0]
  );
};

export const subtract = (...args: number[]) => {
  if (args.length <= 1) {
    throw new Error('subtract function requires at least 2 arguments');
  }
  return args.slice(1).reduce(
    (acc, curr) => acc - curr,
    args[0]
  );
};

export const multiply = (...args: number[]) => {
  if (args.length <= 1) {
    throw new Error('multiply function requires at least 2 arguments');
  }
  return args.slice(1).reduce(
    (acc, curr) => acc * curr,
    args[0]
  );
};

export const divide = (...args: number[]) => {
  if (args.length <= 1) {
    throw new Error('divide function requires at least 2 arguments');
  }
  return args.slice(1).reduce(
    (acc, curr) => acc / curr,
    args[0]
  );
};
