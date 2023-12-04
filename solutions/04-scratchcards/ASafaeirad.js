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
  const lines = input.split('\n');
  const cards = lines.map(parseCard);

  return cards.reduce((acc, card) => acc + card.point, 0);
}

function partTwo() {
  const input = getInput();
  const lines = input.split('\n');
  const cards = lines.map(parseCard);

  const stack = structuredClone(cards);
  let sum = 0;
  while (stack.length > 0) {
    const card = stack.pop();
    const newCards = cards.slice(card.index, card.index + card.matches);
    stack.push.apply(stack, newCards);
    sum++;
  }

  return sum;
}

function parseCard(line, index) {
  const [winnings, numbers] = line
    .split(':')
    .slice(1)[0]
    .split('|')
    .map((i) => i.split(' ').filter(Boolean));

  const matches = getMatchCount({ winnings, numbers });

  return { index: index + 1, matches, point: calculatePoint(matches) };
}

function getMatchCount(card) {
  const winnings = [];
  card.numbers.forEach((num) => {
    if (card.winnings.includes(num)) winnings.push(num);
  });
  return winnings.length;
}

function calculatePoint(matches) {
  return matches === 0 ? 0 : 2 ** (matches - 1);
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
