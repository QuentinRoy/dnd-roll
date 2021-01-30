import * as React from "react";
import solveCommand, { SolvedCommand } from "../api/solveCommand";
import CommandHistory from "../components/CommandHistory";
import ErrorMessage from "../components/ErrorMessage";
import InputHeader from "../components/InputHeader";
import Layout from "../components/Layout";

function reducer(state: State, action: Action) {
  let { input } = state;
  switch (action.type) {
    case "SUBMIT_COMMAND":
      // Set input for case below.
      input = action.value;
    case "SUBMIT_INPUT":
      try {
        let solvedCommand = solveCommand(input);
        return {
          ...state,
          input,
          history: [solvedCommand, ...state.history],
          error: null,
        };
      } catch (e) {
        return { ...state, error: e };
      }
    case "INPUT":
    case "INPUT_COMMAND":
      return { ...state, input: action.value };
  }
}

type State = {
  input: string;
  history: SolvedCommand[];
  error: Error | null;
};

type Action =
  | { type: "SUBMIT_INPUT" }
  | { type: "INPUT"; value: string }
  | { type: "INPUT_COMMAND"; value: string }
  | { type: "SUBMIT_COMMAND"; value: string };

export default function Home() {
  const [{ input, history, error }, dispatch] = React.useReducer(reducer, {
    input: "",
    history: [],
    error: null,
  });

  React.useEffect(() => {
    if (error != null) {
      console.error(error.message);
    }
  }, [error]);

  return (
    <Layout title="D&amp;D Roll">
      <InputHeader
        submitLabel="Roll"
        onChange={(value) => {
          dispatch({ type: "INPUT", value });
        }}
        onSubmit={() => {
          dispatch({ type: "SUBMIT_INPUT" });
        }}
        value={input}
        placeholder="1d20 + 1 >= 12 ? 2d6 + 1"
      />
      <ErrorMessage error={error} />
      <CommandHistory
        commands={history}
        onClick={(cmd) => {
          dispatch({ type: "INPUT_COMMAND", value: cmd.text });
        }}
        onDoubleClick={(cmd) => {
          dispatch({ type: "SUBMIT_COMMAND", value: cmd.text });
        }}
      />
    </Layout>
  );
}
