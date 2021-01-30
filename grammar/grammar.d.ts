export function parse(intput: string): Command;

export interface SyntaxError extends Error, TrackedFragment {
  name: "SyntaxError";
  expected: object[];
  found: string | null;
}

type Command<OpType extends Operation = Operation> = {
  optionSet?: OptionSet;
  label?: Label;
  operation: OpType;
};

type Operation = ThrowsOperation | ConditionalOperation | TestOperation;
type ThrowsOperation = { type: "THROWS"; throws: Throw[] } & TrackedFragment;
type ConditionalOperation = {
  type: "CONDITIONAL";
  test: ThrowsOperation;
  comparator: Comparator;
  target: ThrowsOperation;
  success: ThrowsOperation;
} & TrackedFragment;
type TestOperation = {
  type: "TEST";
  test: ThrowsOperation;
  comparator: Comparator;
  target: ThrowsOperation;
} & TrackedFragment;

type Label = { value: string } & TrackedFragment;

type Throw = DiceThrow | NumberThrow;
type DiceThrow = {
  type: "DICE";
  faces: number;
  count: number;
  modifier: Modifier | null;
} & TrackedFragment;
type NumberThrow = { type: "NUMBER"; value: number } & TrackedFragment;
type Modifier = "ADVANTAGE" | "DISADVANTAGE";

type Comparator = { type: ">=" | "<=" | ">" | "<" | "=" } & TrackedFragment;

type OptionSet = { values: Option[] } & TrackedFragment;
type Option = RepeatOption | CritsOption;
type RepeatOption = { type: "REPEAT"; value: number } & TrackedFragment;
type CritsOption = { type: "CRITS"; enabled: boolean } & TrackedFragment;

type TrackedFragment = { location?: Location; text?: string };
type Location = { start: TextRange; end: TextRange };
type TextRange = { offset: number; line: number; column: number };
