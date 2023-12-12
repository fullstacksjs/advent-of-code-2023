#!/usr/bin/env node

/**
 * @typedef {{ condition: string; damaged: number[], totalDamage: number, knownDamages: number, remainingDamages: number, unknowns: number[]}} Row
 */

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
  const rows = input.split('\n').map((r) => {
    const [condition, damageString] = r.split(' ');
    const damaged = damageString.split(',').map((d) => Number.parseInt(d));
    const totalDamage = damaged.reduce(sum);
    const knownDamages = condition.split('').filter((x) => x === '#').length;
    const remainingDamages = totalDamage - knownDamages;

    const unknowns = [...condition.matchAll(/\?/g)].map((i) => i.index);
    return { condition, damaged, totalDamage, knownDamages, remainingDamages, unknowns };
  });
  return rows.map(getPossibleArrangements).reduce(sum);
}
function partTwo() {
  const input = getInput();
  return input * 2;
}

/**
 *
 * @param {Row} row
 * @returns {number}
 */
function getPossibleArrangements(row) {
  const combinations = getCombinations(row.unknowns, row.remainingDamages);
  const damages = combinations
    .map((com) => putDamage(row.condition, com).replace(/\?/g, '.'))
    .map(calculateDamages)
    .filter((item) => areEqual(item, row.damaged));

  return damages.length || 1;
}

function areEqual(arr, arr2) {
  return arr.toString() === arr2.toString();
}

const getCombinations = (collection, combinationLength) => {
  let head,
    tail,
    result = [];
  if (combinationLength > collection.length || combinationLength < 1) {
    return [];
  }
  if (combinationLength === collection.length) {
    return [collection];
  }
  if (combinationLength === 1) {
    return collection.map((element) => [element]);
  }
  for (let i = 0; i < collection.length - combinationLength + 1; i++) {
    head = collection.slice(i, i + 1);
    tail = getCombinations(collection.slice(i + 1), combinationLength - 1);
    for (let j = 0; j < tail.length; j++) {
      result.push(head.concat(tail[j]));
    }
  }
  return result;
};

function putDamage(str, indexes) {
  let curr = str;
  for (const index of indexes) {
    curr = curr.substring(0, index) + '#' + curr.substring(index + 1);
  }
  return curr;
}

function calculateDamages(condition) {
  return condition
    .split('.')
    .map((l) => l.length)
    .filter(Boolean);
}

function sum(a, b) {
  return a + b;
}

if (part === '1') console.log(partOne());
if (part === '2') console.log(partTwo());
