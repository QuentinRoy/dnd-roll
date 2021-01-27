import { ReadonlyDeep } from "type-fest";
import {
  Command,
  ConditionalOperation,
  Operation,
  RunCommand,
  SumCommand,
  ThrowsOperation,
  Throw,
  DiceThrow,
  NumberThrow,
  Comparator,
} from "../grammar/grammar";
import { sum, sumBy, cloneDeep } from "lodash";

export default function solveCommand(
  cmd: ReadonlyDeep<Command>,
): SolvedCommand {
  switch (cmd.type) {
    case "RUN":
      return solveRunCommand(cmd);
    case "SUM":
      return solveSumCommand(cmd);
  }
}

export type SolvedCommand = SolvedRunCommand | SolvedSumCommand;

export function solveRunCommand(
  cmd: ReadonlyDeep<RunCommand>,
): SolvedRunCommand {
  let solvedOperation = solveOperation(cmd.operation);
  return { ...cmd, operation: solvedOperation };
}

export interface SolvedRunCommand extends RunCommand {
  operation: SolvedOperation;
}

export function solveSumCommand(
  cmd: ReadonlyDeep<SumCommand>,
): SolvedSumCommand {
  throw new Error("Sum commands are not yet supported.");
}

export interface SolvedSumCommand extends SumCommand {}

export function solveOperation(op: ReadonlyDeep<Operation>): SolvedOperation {
  switch (op.type) {
    case "THROWS":
      return solveThrowsOperation(op);
    case "CONDITIONAL":
      return solveConditionalOperation(op);
    case "TEST":
      throw new Error("Test operations are not yet supported.");
  }
}

export type SolvedOperation =
  | SolvedThrowsOperation
  | SolvedConditionalOperation;

export function solveThrowsOperation(
  op: ReadonlyDeep<ThrowsOperation>,
): SolvedThrowsOperation {
  let solvedThrows = solveThrows(op.throws);
  return {
    ...op,
    throws: solvedThrows,
    result: sumBy(solvedThrows, (t) => t.result),
  };
}

export function solveThrows(throws: ReadonlyDeep<Throw[]>) {
  return throws.map(solveThrow);
}

export function solveThrow(t: ReadonlyDeep<Throw>): SolvedThrow {
  switch (t.type) {
    case "NUMBER":
      return solveNumberThrow(t);
    case "DICE":
      return solveDiceThrow(t);
  }
}

type SolvedThrow = SolvedDiceThrow | SolvedNumberThrow;

export function solveNumberThrow(t: Readonly<NumberThrow>): SolvedNumberThrow {
  return { ...t, result: t.value };
}

interface SolvedNumberThrow extends NumberThrow {
  result: number;
}

export function solveDiceThrow(t: Readonly<DiceThrow>): SolvedDiceThrow {
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
  for (let i = 0; i < t.count; i++) {
    values.push(1 + Math.floor(Math.random() * t.faces));
  }
  return { ...t, result: sum(values), values };
}

interface SolvedDiceThrow extends DiceThrow {
  result: number;
  values: number[];
  trials: number[][];
}

export interface SolvedThrowsOperation extends ThrowsOperation {
  result: number;
  throws: SolvedThrow[];
}

export function solveConditionalOperation(
  op: ReadonlyDeep<ConditionalOperation>,
): SolvedConditionalOperation {
  let test = solveThrowsOperation(op.test);
  let target = solveThrowsOperation(op.target);
  let isSuccessful = solveComparison(test.result, target.result, op.comparator);
  let success = isSuccessful
    ? solveThrowsOperation(op.success)
    : cloneDeep(op.success);
  let result = isSuccessful ? success.result : null;
  return {
    ...op,
    isSuccessful,
    result,
    test,
    success,
    target,
  };
}

export interface SolvedConditionalOperation extends ConditionalOperation {
  result: number | null;
  test: SolvedThrowsOperation;
  target: SolvedThrowsOperation;
  isSuccessful: boolean;
  success: ThrowsOperation | SolvedThrowsOperation;
}

function solveComparison(
  x: number,
  y: number,
  comparator: Comparator,
): boolean {
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
