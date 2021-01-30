import * as React from "react";
import styles from "./InputHeader.module.scss";

export type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: (newValue: string) => void;
  placeholder?: string;
  submitLabel?: React.ReactNode;
};

export default function Input({
  submitLabel = "Submit",
  value,
  onChange,
  onSubmit,
  placeholder,
}: InputProps) {
  const ref = React.useRef<HTMLFormElement>();

  return (
    <header className={styles.header}>
      <form
        ref={ref}
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          ref.current.classList.add(styles.flash);
          void ref.current.offsetWidth;
          ref.current.classList.remove(styles.flash);
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
    </header>
  );
}
