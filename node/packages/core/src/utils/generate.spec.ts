import { makeArray, randInt } from './generate';

describe('generate', () => {
  test('makeArray', () => {
    expect(makeArray(3)).toEqual([null, null, null]);
    expect(makeArray(3, 1)).toEqual([1, 1, 1]);
  });

  test('randInt', () => {
    for (let i = 0; i < 10; i++) {
      expect(randInt(3, 5)).toBeGreaterThanOrEqual(3);
      expect(randInt(3, 5)).toBeLessThanOrEqual(5);
    }
  });
});
