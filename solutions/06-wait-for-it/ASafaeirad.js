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
  const [times, distances] = input.split('\n').map((l) =>
    l
      .split(':')[1]
      .split(' ')
      .filter(Boolean)
      .map((n) => Number.parseInt(n)),
  );

  const races = times.map((t, i) => ({ time: t, distance: distances[i] }));
  const records = races.map(getRecords);

  return records.reduce((a, b) => a * b);
}

function partTwo() {
  const input = getInput();
  const [time, distance] = input
    .split('\n')
    .map((l) => l.split(':')[1].split(' ').filter(Boolean).join(''))
    .map((x) => Number.parseInt(x, 10));
  const race = { time, distance };

  const records = getRecords(race);

  return records;
}

/**
 * @param {{time: number; distance: number}} race
 * @returns {number}
 */
function getRecords(race) {
  let records = [];
  for (let hold = 1; hold < race.time - 1; hold++) {
    const remaining = race.time - hold;
    const speed = hold;
    const distance = remaining * speed;
    if (distance > race.distance) records.push(distance);
  }
  return records.length;
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
