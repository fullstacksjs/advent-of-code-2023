#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const [part, mode] = process.argv.slice(2);
const parts = ["1", "2"];
if (!parts.includes(part)) {
  console.error(`Usage: <script> <1|2> [example]`);
  process.exit(1);
}

function getInput() {
  const isExample = mode === "example";
  const exampleFile = `example${part}`;
  return isExample
    ? fs.readFileSync(path.resolve(__dirname, "inputs", exampleFile), "utf-8")
    : fs.readFileSync(path.resolve(__dirname, "inputs", "input"), "utf-8");
}

function partOne() {
  const input = getInput();
  return input;
}
function partTwo() {
  const input = getInput();
  return input * 2;
}

if (part === "1") console.log(partOne());
if (part === "2") console.log(partTwo());
