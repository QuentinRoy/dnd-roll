import { uniqueId } from "lodash";
import { Operation, parse } from "../grammar/grammar";
import solveOperation, { SolvedOperation } from "./solveOperation";
import { createOptionRecord, OptionRecord, validateOptions } from "./options";

export default function solveCommand(input: string): SolvedCommand {
  let command = parse(input);
  let options = createOptionRecord(
    command.optionSet?.values ?? [],
    command.operation,
  );
  let operations: SolvedOperation<typeof command.operation>[] = [];
  for (let i = 0; i < (options.repeat ?? 1); i++) {
    operations.push(solveOperation(command.operation, options));
  }
  return {
    label: command.label?.value ?? null,
    text: input,
    type: command.operation.type,
    options,
    id: uniqueId(`solcmd`),
    operations,
  };
}

export type SolvedCommand<T extends Operation = Operation> = {
  text: string;
  label: string | null;
  type: T["type"];
  options: OptionRecord;
  id: string;
  operations: SolvedOperation<T>[];
};
