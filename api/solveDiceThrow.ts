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
  let { faces, count: originalCount, modifier } = t;
  let count = originalCount * diceFactor;
  let trials = [throwDice(count, faces)];
  // If there is advantage or disadvantage, the dice need to be rolled twice
  // to get the best or the worst values.
  if (modifier != null) {
    trials.push(throwDice(count, faces));
  }
  // If there is no modifier, it does not matter if we are going through
  // minBy or maxBy since there is only one trial.
  let values =
    modifier === "ADVANTAGE" ? maxBy(trials, sum) : minBy(trials, sum);
  let result = sum(values);
  return {
    ...t,
    count,
    originalCount,
    faces,
    values,
    result,
    trials,
    isMax: result === Math.max(count * faces, count * Math.sign(faces)),
    isMin: result === Math.min(count * faces, count * Math.sign(faces)),
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
