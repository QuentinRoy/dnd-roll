import { DiceThrow } from "../grammar/grammar";

import { sum } from "lodash";
import { roll } from "./utils";

export default function solveDiceThrow(
  t: Readonly<DiceThrow>,
): SolvedDiceThrow {
  let trial1 = solveSimpleDiceThrow(t);
  if (t.modifier == null) {
    return { ...trial1, trials: [trial1.values] };
  }
  let trial2 = solveSimpleDiceThrow(t);
  if (
    (trial1.result >= trial2.result && t.modifier === "ADVANTAGE") ||
    (trial1.result <= trial2.result && t.modifier === "DISADVANTAGE")
  ) {
    return { ...trial1, trials: [trial1.values, trial2.values] };
  }
  return { ...trial2, trials: [trial1.values, trial2.values] };
}

function solveSimpleDiceThrow(t: Readonly<DiceThrow>) {
  let values: number[] = [];
  let sign = Math.sign(t.count * t.faces);
  for (let i = 0; i < Math.abs(t.count); i++) {
    values.push(sign * roll(Math.abs(t.faces)));
  }
  return { ...t, result: sum(values), values };
}

export type SolvedDiceThrow = DiceThrow & {
  result: number;
  values: number[];
  trials: number[][];
};
