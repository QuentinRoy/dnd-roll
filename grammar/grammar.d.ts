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

type Operation = ThrowsOperation | ConditionalOperation | TestOperation;

type ThrowsOperation = {
  type: "THROWS";
  throws: Throw[];
};

type Throw = DiceThrow | NumberThrow;
type DiceThrow = {
  type: "DICE";
  faces: number;
  count: number;
  modifier: Modifier | null;
};
type NumberThrow = { type: "NUMBER"; value: number };
type Modifier = "ADVANTAGE" | "DISADVANTAGE";

type ConditionalOperation = {
  type: "CONDITIONAL";
  test: ThrowsOperation;
  comparator: Comparator;
  target: ThrowsOperation;
  success: ThrowsOperation;
};

type TestOperation = {
  type: "TEST";
  test: ThrowsOperation;
  comparator: Comparator;
  target: ThrowsOperation;
};

type Comparator = ">=" | "<=" | ">" | "<" | "=";

type Location = { start: TextRange; end: TextRange };
type TextRange = { offset: number; line: number; column: number };
