import { SolvedCommand } from "../api/solveCommand";

export type CommandHistoryProps = { commands: SolvedCommand[] };

export default function CommandHistory({ commands }: CommandHistoryProps) {
  return (
    <ul>
      {commands.map((c) => (
        <li key={c.id}>
          {c.operations[0].result == null ? "failed" : c.operations[0].result}
        </li>
      ))}
    </ul>
  );
}
