const peg = require("pegjs");
const { join } = require("path");
const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const INPUT_FILE = join(__dirname, "../grammar/grammar.pegjs");
const OUTPUT_FILE = join(__dirname, "../grammar/grammar.js");

readFile(INPUT_FILE).then((buffer) => {
  let code = peg.generate(buffer.toString(), {
    format: "commonjs",
    output: "source",
  });
  return writeFile(OUTPUT_FILE, code);
});
