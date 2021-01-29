import { ReadonlyDeep } from "type-fest";
import { Operation, Option } from "../grammar/grammar";

export type OptionRecord = {
  areCritsEnabled?: boolean;
  repeat?: number;
};

export function createOptionRecord(
  options: ReadonlyDeep<Option[]>,
  operation: ReadonlyDeep<Operation>,
) {
  validateOptions(options);
  let rec: OptionRecord = {};
  for (let i = 0; i < options.length; i++) {
    let opt = options[i];
    switch (opt.type) {
      case "CRITS":
        rec.areCritsEnabled = opt.enabled;
        break;
      case "REPEAT":
        rec.repeat = opt.value;
        break;
    }
  }
  if (rec.areCritsEnabled == null) {
    if (operation.type === "CONDITIONAL") {
      rec.areCritsEnabled = true;
    } else if (operation.type === "TEST") {
      rec.areCritsEnabled = false;
    }
  }
  return rec;
}

export function validateOptions(options: ReadonlyDeep<Option[]>) {
  for (let i = 0; i < options.length; i++) {
    let op = options[i];
    let conflict = options.slice(0, i).find((c) => c.type === op.type);
    if (conflict) {
      throw new Error(
        `Conflicting options: "${op.text}" and "${conflict.text}"`,
      );
    }
  }
}
