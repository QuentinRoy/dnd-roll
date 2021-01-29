import { ReadonlyDeep } from "type-fest";
import { sumBy, cloneDeep } from "lodash";
import { Throw, ThrowsOperation } from "../grammar/grammar";
import solveNumberThrow, { SolvedNumberThrow } from "./solveNumberThrow";
import solveDiceThrow, { SolvedDiceThrow } from "./solveDiceThrow";

type ThrowOptions = { diceFactor?: number };

export default function solveThrowsOperation(
  operation: ReadonlyDeep<ThrowsOperation>,
  options?: ThrowOptions,
): SolvedThrowsOperation {
  let solvedThrows = solveThrows(operation.throws, options);
  return {
    ...(cloneDeep(operation) as ThrowsOperation),
    throws: solvedThrows,
    result: sumBy(solvedThrows, (t) => t.result),
    isMax: solvedThrows.every((t) => t.type === "NUMBER" || t.isMax),
    isMin: solvedThrows.every((t) => t.type === "NUMBER" || t.isMin),
  };
}

export type SolvedThrowsOperation = ThrowsOperation & {
  result: number;
  throws: SolvedThrow[];
  isMax: boolean;
  isMin: boolean;
};

export type SolvedThrow = SolvedDiceThrow | SolvedNumberThrow;

function solveThrows(throws: ReadonlyDeep<Throw[]>, options?: ThrowOptions) {
  return throws.map((t) => solveThrow(t, options));
}

function solveThrow(
  t: ReadonlyDeep<Throw>,
  options?: ThrowOptions,
): SolvedThrow {
  switch (t.type) {
    case "NUMBER":
      return solveNumberThrow(t);
    case "DICE":
      return solveDiceThrow(t, options);
  }
}
