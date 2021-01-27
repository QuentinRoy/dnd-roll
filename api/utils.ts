import { Comparator } from "../grammar/grammar";

export function compare(x: number, y: number, comparator: Comparator): boolean {
  switch (comparator) {
    case ">=":
      return x >= y;
    case "<=":
      return x <= y;
    case "<":
      return x < y;
    case ">":
      return x > y;
    case "=":
      return x === y;
  }
}

export function roll(max) {
  if (max < 1) {
    throw new Error(
      `Invalid value: ${max}. roll only supports positive numbers.`,
    );
  }
  return 1 + Math.floor(Math.random() * max);
}
