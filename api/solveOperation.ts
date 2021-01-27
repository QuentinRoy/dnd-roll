import { ReadonlyDeep } from "type-fest";
import { Operation } from "../grammar/grammar";
import solveConditionalOperation, {
  SolvedConditionalOperation,
} from "./solveConditionalOperation";
import solveThrowsOperation, {
  SolvedThrowsOperation,
} from "./solveThrowsOperation";

export default function solveOperation(
  op: ReadonlyDeep<Operation>,
): SolvedOperation {
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
