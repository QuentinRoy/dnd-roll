import Head from "next/head";
import * as React from "react";
import solveCommand, { SolvedCommand } from "../api/solveCommand";
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
    <div>
      <Head>
        <title>D&amp;D Roll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            dispatch({ type: "SUBMIT" });
          }}
        >
          <input
            type="text"
            placeholder="1d20 + 1 > 12 ? 2d6 + 1"
            value={input}
            onChange={(evt) => {
              dispatch({ type: "INPUT", input: evt.target.value });
            }}
          />
        </form>
        <div>{error == null ? null : error.message}</div>
        <ul>
          {history.map((c) => (
            <li key={c.id}>
              {c.operations[0].result == null
                ? "failed"
                : c.operations[0].result}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
