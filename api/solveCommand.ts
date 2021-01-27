import { ReadonlyDeep } from "type-fest";
import { Command } from "../grammar/grammar";
import solveRunCommand, { SolvedRunCommand } from "./solveRunCommand";
import { SolvedSumCommand, solveSumCommand } from "./solveSumCommand";

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
