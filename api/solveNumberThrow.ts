import { NumberThrow } from "../grammar/grammar";

export default function solveNumberThrow(
  t: Readonly<NumberThrow>,
): SolvedNumberThrow {
  return { ...t, result: t.value };
}

export type SolvedNumberThrow = NumberThrow & { result: number };
