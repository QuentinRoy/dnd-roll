import { RunCommand } from "../grammar/grammar";
import solveOperation, { SolvedOperation } from "./solveOperation";
import { ReadonlyDeep } from "type-fest";

export default function solveRunCommand(
  cmd: ReadonlyDeep<RunCommand>,
): SolvedRunCommand {
  let solvedOperation = solveOperation(cmd.operation);
  return { ...cmd, operation: solvedOperation };
}

export type SolvedRunCommand = RunCommand & { operation: SolvedOperation };
