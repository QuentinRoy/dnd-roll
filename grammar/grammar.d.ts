export function parse(intput: string): Command;

export class SyntaxError extends Error {
  name: "SyntaxError";
  message: string;
  expected: object[];
  found: string | null;
  location: Location;
}

type Command = RunCommand | SumCommand;

type RunCommand = {
  label?: string;
  type: "RUN";
  operation: Operation;
};

type SumCommand = {
  label?: string;
  type: "SUM";
  value: number;
  operation: Operation;
};

type Operation = ThrowOperation | ConditionalOperation;

type ThrowOperation = {
  type: "THROWS";
  throws: Throw[];
  modifier?: Modifier;
};

type Throw = DiceThrow | NumberThrow;

type Modifier = "ADVANTAGE" | "DISADVANTAGE";

type DiceThrow = {
  type: "DICE";
  faces: number;
  counter: number;
};

type NumberThrow = {
  type: "NUMBER";
  value: number;
};

type ConditionalOperation = {
  type: "CONDITIONAL";
  test: ThrowOperation;
  comparator: Comparator;
  target: ThrowOperation;
  success: ThrowOperation;
};

type Comparator = ">=" | "<=" | ">" | "<" | "=";

type Location = {
  start: TextRange;
  end: TextRange;
};

type TextRange = {
  offset: number;
  line: number;
  column: number;
};
