import { ReadonlyDeep } from "type-fest";
import { Operation } from "../grammar/grammar";
import { OptionRecord } from "./options";
import solveConditionalOperation, {
  SolvedConditionalOperation,
} from "./solveConditionalOperation";
import solveThrowsOperation, {
  SolvedThrowsOperation,
} from "./solveThrowsOperation";

export default function solveOperation(
  operation: ReadonlyDeep<Operation>,
  options: OptionRecord,
): SolvedOperation {
  switch (operation.type) {
    case "THROWS":
      return solveThrowsOperation(operation);
    case "CONDITIONAL":
      return solveConditionalOperation(operation, options);
    case "TEST":
      throw new Error("Test operations are not yet supported.");
  }
}

export type SolvedOperation =
  | SolvedThrowsOperation
  | SolvedConditionalOperation;
