import { ReadonlyDeep } from "type-fest";
import { cloneDeep } from "lodash";
import { ConditionalOperation, ThrowsOperation } from "../grammar/grammar";
import solveThrowsOperation, {
  SolvedThrowsOperation,
} from "./solveThrowsOperation";
import { compare } from "./utils";

export default function solveConditionalOperation(
  op: ReadonlyDeep<ConditionalOperation>,
): SolvedConditionalOperation {
  let clonedOp = cloneDeep(op);
  let test = solveThrowsOperation(op.test);
  let target = solveThrowsOperation(op.target);
  let isSuccessful = compare(test.result, target.result, op.comparator.type);
  let success = isSuccessful
    ? solveThrowsOperation(op.success)
    : clonedOp.success;
  let result = isSuccessful ? success.result : null;
  return {
    ...clonedOp,
    isSuccessful,
    result,
    test,
    success,
    target,
  };
}

export type SolvedConditionalOperation = ConditionalOperation & {
  isSuccessful: boolean;
  result: number | null;
  test: SolvedThrowsOperation;
  target: SolvedThrowsOperation;
  success: ThrowsOperation | SolvedThrowsOperation;
};
