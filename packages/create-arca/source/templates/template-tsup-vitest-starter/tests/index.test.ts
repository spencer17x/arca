import { describe, expect, it } from 'vitest';

import { add, divide, multiply, subtract } from '../src';

describe('test index.ts', () => {
  it('test add function', () => {
    expect(add(1, 1)).toEqual(2);
  });

  it('test subtract function', () => {
    expect(subtract(1, 1)).toEqual(0);
  });

  it('test multiply function', () => {
    expect(multiply(1, 1)).toEqual(1);
  });

  it('test divide function', () => {
    expect(divide(1, 1)).toEqual(1);
  });
});
