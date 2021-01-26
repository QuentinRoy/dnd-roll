import Head from "next/head";
import * as React from "react";
import { parse, SyntaxError as GrammarError } from "../grammar/grammar";

export default function Home() {
  const [command, setCommand] = React.useState("1d20+5 > 17 ? 2d8+3");

  return (
    <div>
      <Head>
        <title>D&D Roll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            try {
              let c = parse(command);
              console.log(c.operation.type);
              setCommand("");
            } catch (e) {
              if (e instanceof GrammarError) {
                console.error(e.message);
              }
            }
          }}
        >
          <input
            type="text"
            value={command}
            onChange={(evt) => {
              setCommand(evt.target.value);
            }}
          />
        </form>
      </main>
    </div>
  );
}
