import { ReadonlyDeep } from "type-fest";
import { Option } from "../grammar/grammar";

export class OptionRecord {
  public areCritsEnabled: boolean = true;
  public repeat: number = 1;

  constructor(options: ReadonlyDeep<Option[]>) {
    for (let i = 0; i < options.length; i++) {
      let op = options[i];
      switch (op.type) {
        case "CRITS":
          this.areCritsEnabled = op.enabled;
          break;
        case "REPEAT":
          this.repeat = op.value;
          break;
      }
    }
  }
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
