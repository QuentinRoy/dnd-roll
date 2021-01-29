import { DiceThrow } from "../grammar/grammar";
import { sum, cloneDeep, maxBy, minBy } from "lodash";
import { roll } from "./utils";
import { ReadonlyDeep } from "type-fest";

type DiceThrowOptions = {
  diceFactor?: number;
};

export default function solveDiceThrow(
  t: ReadonlyDeep<DiceThrow>,
  { diceFactor = 1 }: DiceThrowOptions = {},
): SolvedDiceThrow {
  let count = t.count * diceFactor;
  let { faces } = t;
  let trials = [throwDice(count, faces)];
  if (t.modifier != null) {
    trials.push(throwDice(count, faces));
  }
  let values =
    t.modifier === "ADVANTAGE" ? maxBy(trials, sum) : minBy(trials, sum);
  let result = sum(values);
  return {
    ...t,
    count,
    originalCount: t.count,
    faces,
    values,
    result,
    trials,
    isMax: Math.abs(result) === Math.abs(count * t.faces),
    isMin: Math.abs(result) === Math.abs(count),
  };
}

function throwDice(count: number, faces: number) {
  let values: number[] = [];
  let sign = Math.sign(count * faces);
  for (let i = 0; i < Math.abs(count); i++) {
    values.push(sign * roll(Math.abs(faces)));
  }
  return values;
}

export type SolvedDiceThrow = DiceThrow & {
  originalCount: number;
  result: number;
  values: number[];
  trials: number[][];
  isMax: boolean;
  isMin: boolean;
};
