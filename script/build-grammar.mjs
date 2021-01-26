import peg from "pegjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const INPUT_FILE = join(DIR_NAME, "../grammar/grammar.pegjs");
const OUTPUT_FILE = join(DIR_NAME, "../grammar/grammar.js");

readFile(INPUT_FILE).then((buffer) => {
  let code = peg.generate(buffer.toString(), {
    format: "commonjs",
    output: "source",
  });
  return writeFile(OUTPUT_FILE, code);
});
