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
  const sets = input.split('\n').map((l) => {
    const [hand, bet] = l.split(' ');
    return {
      hand: hand.replace(/[A-Z]/g, (r) => {
        if (r === 'A') return 'Z';
        if (r === 'K') return 'Y';
        if (r === 'Q') return 'X';
        if (r === 'J') return 'R';
        if (r === 'T') return 'J';
      }),
      bet: +bet,
    };
  });
  return sets
    .map((s) => ({ ...s, ...getType(s) }))
    .sort((a, b) => {
      const kind = a.kind - b.kind;
      if (kind === 0) return a.hand.localeCompare(b.hand);
      return kind;
    })
    .reduce((acc, s, i) => acc + s.bet * (i + 1), 0);
}
function kindOf(s) {
  if (s.kind === 5) return 'High';
  if (s.kind === 10) return 'Two';
  if (s.kind === 11) return 'Three';
  if (s.kind === 8) return 'Pair';
  if (s.kind === 13) return 'Full';
  if (s.kind === 14) return 'Four';
  if (s.kind === 15) return 'Five';
  return s.kind;
}

function getType(set) {
  let cards = [];
  for (const card of set.hand) {
    const already = cards.find((c) => c.card == card);
    if (already) already.count++;
    else cards.push({ card, count: 1 });
  }
  cards.sort((a, b) => {
    if (a.card === '0') return +Infinity;
    if (b.card === '0') return -Infinity;
    const count = b.count - a.count;
    if (count === 0) return b.card.localeCompare(a.card);
    return count;
  });

  const lastCard = cards.at(-1);
  const hasJoker = lastCard.card === '0';
  const isOnlyJoker = cards[0].card === '0';
  const jokers = hasJoker ? lastCard.count : 0;
  let point = cards[0].count;
  if (!isOnlyJoker) {
    point += jokers;
  }

  let additionalPoint = 0;
  if (cards[1] && cards[1].card !== '0') additionalPoint = cards[1].count * 2;

  return {
    kind: point * 3 + additionalPoint,
    strong: cards[0].card,
    jokers: lastCard.card === '0' ? lastCard.count : 0,
  };
}

function partTwo() {
  const input = getInput();
  const sets = input.split('\n').map((l) => {
    const [hand, bet] = l.split(' ');
    return {
      hand: hand.replace(/[A-Z]/g, (r) => {
        if (r === 'A') return 'Z';
        if (r === 'K') return 'Y';
        if (r === 'Q') return 'X';
        if (r === 'J') return '0';
        if (r === 'T') return 'J';
      }),
      bet: +bet,
    };
  });

  return sets
    .map((s) => ({ ...s, ...getType(s) }))
    .sort((a, b) => {
      const kind = a.kind - b.kind;
      if (kind === 0) return a.hand.localeCompare(b.hand);
      return kind;
    })
    .reduce((acc, s, i) => acc + s.bet * (i + 1), 0);
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
