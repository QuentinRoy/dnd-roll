import { ReadonlyDeep } from "type-fest";
import { sumBy, cloneDeep } from "lodash";
import { Throw, ThrowsOperation } from "../grammar/grammar";
import solveNumberThrow, { SolvedNumberThrow } from "./solveNumberThrow";
import solveDiceThrow, { SolvedDiceThrow } from "./solveDiceThrow";

export default function solveThrowsOperation(
  op: ReadonlyDeep<ThrowsOperation>,
): SolvedThrowsOperation {
  let solvedThrows = solveThrows(op.throws);
  return {
    ...cloneDeep(op),
    throws: solvedThrows,
    result: sumBy(solvedThrows, (t) => t.result),
  };
}

export type SolvedThrowsOperation = ThrowsOperation & {
  result: number;
  throws: SolvedThrow[];
};

export type SolvedThrow = SolvedDiceThrow | SolvedNumberThrow;

function solveThrows(throws: ReadonlyDeep<Throw[]>) {
  return throws.map(solveThrow);
}

function solveThrow(t: ReadonlyDeep<Throw>): SolvedThrow {
  switch (t.type) {
    case "NUMBER":
      return solveNumberThrow(t);
    case "DICE":
      return solveDiceThrow(t);
  }
}
