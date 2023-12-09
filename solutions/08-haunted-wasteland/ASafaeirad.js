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
  const [instructions, _, ...rawMaps] = input.split('\n');
  const maps = rawMaps.reduce(parseMap, {});
  let current = maps['AAA'];
  let index = 0;
  while (current != maps['ZZZ']) {
    const ins = instructions[index % instructions.length];
    current = ins === 'L' ? maps[current.left] : maps[current.right];
    index++;
  }
  return index;
}

function parseMap(acc, line) {
  const [key, values] = line.split('=');
  const [left, right] = values.split(',').map((m) => m.replace(/[( )]/g, ''));
  return { ...acc, [key.trim()]: { left, right } };
}

function partTwo() {
  const input = getInput();
  const [instructions, _, ...rawMaps] = input.split('\n');
  const maps = rawMaps.reduce(parseMap, {});
  let nodes = Object.keys(maps)
    .filter((k) => k.endsWith('A'))
    .map((k) => maps[k]);
  let index = 0n;
  let isFinished = 0;
  const nodesCount = nodes.length;
  let counter = 0;

  do {
    const ins = instructions[counter];
    isFinished = 0;
    for (const i in nodes) {
      next = ins === 'L' ? nodes[i].left : nodes[i].right;
      if (next.endsWith('Z')) isFinished++;
      if (isFinished > 3) console.log(nodes, isFinished);
      nodes[i] = maps[next];
    }
    index++;
    if (++counter === instructions.length) counter = 0;
  } while (isFinished < nodesCount);

  return index;
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
