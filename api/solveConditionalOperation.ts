import { ReadonlyDeep } from "type-fest";
import { cloneDeep } from "lodash";
import { ConditionalOperation, ThrowsOperation } from "../grammar/grammar";
import solveThrowsOperation, {
  SolvedThrowsOperation,
} from "./solveThrowsOperation";
import { compare } from "./utils";
import { OptionRecord } from "./options";

export default function solveConditionalOperation(
  operation: ReadonlyDeep<ConditionalOperation>,
  { areCritsEnabled }: OptionRecord,
): SolvedConditionalOperation {
  let clonedOp = cloneDeep(operation) as ConditionalOperation;
  let test = solveThrowsOperation(operation.test);
  let target = solveThrowsOperation(operation.target);
  let isCriticalSuccess = areCritsEnabled && test.isMax && !test.isMin;
  let isCriticalFailure = areCritsEnabled && test.isMin && !test.isMax;
  let isSuccessful =
    isCriticalSuccess ||
    (!isCriticalFailure &&
      compare(test.result, target.result, operation.comparator.type));
  let success = clonedOp.success;
  let result = null;
  if (isSuccessful) {
    let solvedSuccess = solveThrowsOperation(operation.success, {
      diceFactor: isCriticalSuccess ? 2 : 1,
    });
    success = solvedSuccess;
    result = solvedSuccess.result;
  }
  return {
    ...clonedOp,
    isSuccessful,
    isCriticalSuccess,
    isCriticalFailure,
    result,
    test,
    success,
    target,
  };
}

export type SolvedConditionalOperation = ConditionalOperation & {
  isCriticalSuccess: boolean;
  isCriticalFailure: boolean;
  isSuccessful: boolean;
  result: number | null;
  test: SolvedThrowsOperation;
  target: SolvedThrowsOperation;
  success: ThrowsOperation | SolvedThrowsOperation;
};
