import { sumBy, countBy } from "lodash";
import { SolvedConditionalOperation } from "../api/solveConditionalOperation";
import { ConditionalOperation, ThrowsOperation } from "../grammar/grammar";
import classNames from "classnames";
import styles from "./CommandItem.module.scss";
import { SolvedCommand } from "../api/solveCommand";

type CommandItemProps = {
  command: SolvedCommand;
  onClick: (cmd: SolvedCommand) => void;
  onDoubleClick: (cmd: SolvedCommand) => void;
};
export default function CommandItem({
  command,
  onClick,
  onDoubleClick,
  ...props
}: CommandItemProps) {
  const onClickWrapper = () => onClick(command);
  const onDoubleClickWrapper = () => onDoubleClick(command);
  switch (command.type) {
    case "CONDITIONAL":
      return (
        <div onClick={onClickWrapper} onDoubleClick={onDoubleClickWrapper}>
          <ConditionalCommandItem
            command={command as SolvedCommand<ConditionalOperation>}
            {...props}
          />
        </div>
      );
    case "THROWS":
      return (
        <div onClick={onClickWrapper} onDoubleClick={onDoubleClickWrapper}>
          <ThrowsCommandItem
            command={command as SolvedCommand<ThrowsOperation>}
            {...props}
          />
        </div>
      );
  }
}

type ConditionalCommandItemProps = {
  command: SolvedCommand<ConditionalOperation>;
};
function ConditionalCommandItem({ command }: ConditionalCommandItemProps) {
  let {
    critSuccesses = 0,
    critFailures = 0,
    failures = 0,
    successes = 0,
  } = countBy(command.operations, (o: SolvedConditionalOperation) => {
    if (o.isCriticalSuccess) return "critSuccesses";
    if (o.isCriticalFailure) return "critFailures";
    if (o.isSuccessful) return "successes";
    return "failures";
  });
  let total = sumBy(
    command.operations,
    (o: SolvedConditionalOperation) => o.result ?? 0,
  );
  return (
    <div className={classNames(styles.item, styles.conditionalCommand)}>
      <div className={styles.header}>{command.text}</div>
      <div className={styles.details}>
        {successes <= 0 ? null : (
          <span className={styles.successes}>{successes}</span>
        )}{" "}
        {critSuccesses <= 0 ? null : (
          <span className={classNames(styles.crits, styles.successes)}>
            {critSuccesses}
          </span>
        )}{" "}
        {failures <= 0 ? null : (
          <span className={styles.failures}>{failures}</span>
        )}{" "}
        {critFailures <= 0 ? null : (
          <span className={classNames(styles.crits, styles.failures)}>
            {critFailures}
          </span>
        )}
        {command.label == null ? null : (
          <span className={classNames(styles.label)}>{command.label}</span>
        )}
      </div>
      <div className={styles.total}>{total ?? 0}</div>
    </div>
  );
}

type ThrowsCommandItem = { command: SolvedCommand<ThrowsOperation> };
function ThrowsCommandItem({ command }: ThrowsCommandItem) {
  let total = sumBy(command.operations, (o) => o.result);
  return (
    <div className={classNames(styles.item, styles.throwsCommand)}>
      <div className={styles.header}>{command.text}</div>
      <div className={styles.details}>
        <span className={styles.rolls}>{command.operations.length}</span>
        {command.label == null ? null : (
          <span className={classNames(styles.label)}>{command.label}</span>
        )}
      </div>
      <div className={styles.total}>{total}</div>
    </div>
  );
}
