import { SolvedCommand } from "../api/solveCommand";
import * as React from "react";
import styles from "./CommandHistory.module.scss";
import NonMemoCommandItem from "./CommandItem";

const CommandItem = React.memo(NonMemoCommandItem);

export type CommandHistoryProps = {
  commands: SolvedCommand[];
  onClick?: (cmd: SolvedCommand) => void;
  onDoubleClick?: (cmd: SolvedCommand) => void;
};
export default function CommandHistory({
  commands,
  onClick = () => {},
  onDoubleClick = () => {},
}: CommandHistoryProps) {
  return (
    <div className={styles.main}>
      <ul>
        {commands.map((c) => (
          <li key={c.id}>
            <CommandItem
              command={c}
              onClick={onClick}
              onDoubleClick={onDoubleClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
