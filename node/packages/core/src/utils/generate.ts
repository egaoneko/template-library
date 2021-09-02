export function makeArray(length: number, initValue: unknown | null = null) {
  return new Array(length).fill(initValue);
}
export function randInt(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}
