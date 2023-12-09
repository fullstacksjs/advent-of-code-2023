#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const [part, mode] = process.argv.slice(2);
const parts = ['1', '2'];
if (!parts.includes(part)) {
  console.error(`Usage: <script> <1|2> [example]`);
  process.exit(1);
}

function getInput() {
  const isExample = mode === 'example';
  const exampleFile = `example${part}`;
  return isExample
    ? fs.readFileSync(path.resolve(__dirname, 'inputs', exampleFile), 'utf-8').trimEnd()
    : fs.readFileSync(path.resolve(__dirname, 'inputs', 'input'), 'utf-8').trimEnd();
}

function partOne() {
  const input = getInput();
  const histories = input.split('\n').map((m) => m.split(' ').map((h) => Number.parseInt(h)));
  const predicts = histories.map(getPredict);

  return predicts.reduce((a, b) => a + b);
}

function partTwo() {
  const input = getInput();
  const histories = input.split('\n').map((m) =>
    m
      .split(' ')
      .map((h) => Number.parseInt(h))
      .reverse(),
  );
  const predicts = histories.map(getPredict);

  return predicts.reduce((a, b) => a + b);
}

/**
 *
 * @param {number[]} history
 * @returns
 */
function getPredict(history) {
  const diffs = [];
  for (let curr = 0; curr < history.length - 1; curr++) {
    diffs.push(history[curr + 1] - history[curr]);
  }
  if (diffs.every((e) => e === 0)) return history.at(-1);
  return history.at(-1) + getPredict(diffs);
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
