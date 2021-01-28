import * as React from "react";
import solveCommand, { SolvedCommand } from "../api/solveCommand";
import CommandHistory from "../components/CommandHistory";
import ErrorMessage from "../components/ErrorMessage";
import Input from "../components/Input";
import Layout from "../components/Layout";
import { parse } from "../grammar/grammar";

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SUBMIT":
      try {
        let command = parse(state.input);
        let solvedCommand = solveCommand(command);
        return {
          ...state,
          history: [solvedCommand, ...state.history],
          error: null,
        };
      } catch (e) {
        return { ...state, error: e };
      }
    case "INPUT":
      return { ...state, input: action.input };
  }
}

type State = {
  input: string;
  history: SolvedCommand[];
  error: Error | null;
};

type Action = { type: "SUBMIT" } | { type: "INPUT"; input: string };

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
      <main>
        <Input
          submitLabel="Roll"
          onChange={(value) => {
            dispatch({ type: "INPUT", input: value });
          }}
          onSubmit={() => {
            dispatch({ type: "SUBMIT" });
          }}
          value={input}
          placeholder="1d20 + 1 > 12 ? 2d6 + 1"
        />
        <ErrorMessage error={error} />
        <CommandHistory commands={history} />
      </main>
    </Layout>
  );
}
