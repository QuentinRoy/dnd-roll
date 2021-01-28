import { ReactElement, ReactNode } from "react";
import styles from "./Input.module.scss";

export type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: (newValue: string) => void;
  placeholder?: string;
  submitLabel?: ReactNode;
};

export default function Input({
  submitLabel = "Submit",
  value,
  onChange,
  onSubmit,
  placeholder,
}: InputProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(evt) => {
        evt.preventDefault();
        onSubmit(value);
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(evt) => {
          onChange(evt.target.value);
        }}
        className={styles.input}
        required
      />
      <button className={styles.button} type="submit" disabled={value === ""}>
        {submitLabel}
      </button>
    </form>
  );
}
