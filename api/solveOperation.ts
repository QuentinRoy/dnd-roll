import { ReadonlyDeep } from "type-fest";
import {
  ConditionalOperation,
  Operation,
  ThrowsOperation,
} from "../grammar/grammar";
import { OptionRecord } from "./options";
import solveConditionalOperation, {
  SolvedConditionalOperation,
} from "./solveConditionalOperation";
import solveThrowsOperation, {
  SolvedThrowsOperation,
} from "./solveThrowsOperation";

export default function solveOperation<OperationType extends Operation>(
  operation: ReadonlyDeep<OperationType>,
  options: OptionRecord,
): SolvedOperation<OperationType> {
  switch (operation.type) {
    case "THROWS":
      return solveThrowsOperation(
        operation as ReadonlyDeep<ThrowsOperation>,
      ) as SolvedOperation<OperationType>;
    case "CONDITIONAL":
      return solveConditionalOperation(
        operation as ReadonlyDeep<ConditionalOperation>,
        options,
      ) as SolvedOperation<OperationType>;
    case "TEST":
      throw new Error("Test operations are not yet supported.");
  }
}

export type SolvedOperation<Operation> = Operation extends ConditionalOperation
  ? SolvedConditionalOperation
  : Operation extends ThrowsOperation
  ? SolvedThrowsOperation
  : never;
// export type SolvedOperation =
//   | SolvedThrowsOperation
//   | SolvedConditionalOperation;
