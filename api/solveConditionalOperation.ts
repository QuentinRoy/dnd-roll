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
  let test = solveThrowsOperation(op.test);
  let target = solveThrowsOperation(op.target);
  let isSuccessful = compare(test.result, target.result, op.comparator);
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

export type SolvedConditionalOperation = ConditionalOperation & {
  result: number | null;
  test: SolvedThrowsOperation;
  target: SolvedThrowsOperation;
  isSuccessful: boolean;
  success: ThrowsOperation | SolvedThrowsOperation;
};
