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
  const [seedInput, ...mapInputs] = input.split(/\n\n/);
  const seeds = seedInput
    .split(':')[1]
    .split(' ')
    .filter(Boolean)
    .map((x) => Number.parseInt(x, 10));
  const maps = mapInputs.map((map) =>
    map
      .split('\n')
      .slice(1)
      .map((l) => l.split(' ').map((x) => Number.parseInt(x, 10))),
  );
  const locations = seeds.map((seed) => maps.reduce((acc, map) => mapper(acc, map), seed));

  return Math.min(...locations);
}
function partTwo() {
  const input = getInput();
  const [seedInput, ...mapInputs] = input.split(/\n\n/);
  const seeds = Object.values(
    Object.groupBy(
      seedInput
        .split(':')[1]
        .split(' ')
        .map((i) => Number.parseInt(i))
        .filter(Boolean),
      (_, i) => Math.ceil((i + 1) / 2),
    ),
  );
  const maps = mapInputs.map((map) =>
    map
      .split('\n')
      .slice(1)
      .map((l) => l.split(' ').map((x) => Number.parseInt(x, 10))),
  );
  let lowestLocation = Infinity;

  for (const [initialSeed, length] of seeds) {
    for (let seed = initialSeed; seed < initialSeed + length; seed++) {
      let location = maps.reduce((acc, map) => mapper(acc, map), seed);
      if (location < lowestLocation) lowestLocation = location;
    }
  }

  return Math.min(lowestLocation);
}

const isInMap = (num, [_, source, length]) => num >= source && num < source + length;

function mapper(num, maps) {
  const map = maps.find((m) => isInMap(num, m));
  if (!map) {
    return num;
  }
  const diff = map[0] - map[1];
  return num + diff;
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
