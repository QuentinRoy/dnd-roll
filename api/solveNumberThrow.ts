import { ReadonlyDeep } from "type-fest";
import { NumberThrow } from "../grammar/grammar";

export default function solveNumberThrow(
  t: ReadonlyDeep<NumberThrow>,
): SolvedNumberThrow {
  return { ...t, result: t.value };
}

export type SolvedNumberThrow = NumberThrow & { result: number };
