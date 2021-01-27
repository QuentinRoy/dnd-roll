import { ReadonlyDeep } from "type-fest";
import { SumCommand } from "../grammar/grammar";

export function solveSumCommand(
  cmd: ReadonlyDeep<SumCommand>,
): SolvedSumCommand {
  throw new Error("Sum commands are not yet supported.");
}

export interface SolvedSumCommand extends SumCommand {}
