import { ReadonlyDeep } from "type-fest";
import { uniqueId } from "lodash";
import { Command } from "../grammar/grammar";
import solveOperation, { SolvedOperation } from "./solveOperation";
import { createOptionRecord, OptionRecord, validateOptions } from "./options";

export default function solveCommand(
  command: ReadonlyDeep<Command>,
): SolvedCommand {
  let options = createOptionRecord(
    command.optionSet?.values ?? [],
    command.operation,
  );
  let operations = [];
  for (let i = 0; i < (options.repeat ?? 1); i++) {
    operations.push(solveOperation(command.operation, options));
  }
  return {
    options,
    id: uniqueId(`solcmd`),
    operations,
  };
}

export type SolvedCommand = {
  options: OptionRecord;
  id: string;
  operations: SolvedOperation[];
};
