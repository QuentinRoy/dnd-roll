import { ReadonlyDeep } from "type-fest";
import { cloneDeep, uniqueId } from "lodash";
import { Command } from "../grammar/grammar";
import solveOperation, { SolvedOperation } from "./solveOperation";
import { OptionRecord, validateOptions } from "./options";

export default function solveCommand(
  command: ReadonlyDeep<Command>,
): SolvedCommand {
  let options: OptionRecord;
  if (command.optionSet != null) {
    validateOptions(command.optionSet.values);
    options = new OptionRecord(command.optionSet.values);
  } else {
    options = new OptionRecord([]);
  }
  if (options.repeat > 1) throw new Error(`repeat not supported yet`);
  if (options.areCritsEnabled) throw new Error(`crits not supported yet`);
  return {
    options,
    id: uniqueId(`solcmd`),
    operations: [solveOperation(command.operation)],
  };
}

export type SolvedCommand = {
  options: OptionRecord;
  id: string;
  operations: SolvedOperation[];
};
