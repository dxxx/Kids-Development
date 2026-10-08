import { createRng, type Rng } from '../../core/rng';

export type Clue =
  | { kind: 'gt'; n: number }
  | { kind: 'lt'; n: number }
  | { kind: 'endsIn'; d: number }
  | { kind: 'odd' }
  | { kind: 'even' }
  | { kind: 'oneMore'; n: number }
  | { kind: 'oneLess'; n: number }
  | { kind: 'tens'; d: number };

export interface RiddlePuzzle {
  board: number[];
  answer: number;
  clues: Clue[];
}

export const RIDDLE_MAX_LEVEL = 9;

export function holds(c: Clue, x: number): boolean {
  switch (c.kind) {
    case 'gt':
      return x > c.n;
    case 'lt':
      return x < c.n;
    case 'endsIn':
      return x % 10 === c.d;
    case 'odd':
      return x % 2 === 1;
    case 'even':
      return x % 2 === 0;
    case 'oneMore':
      return x === c.n + 1;
    case 'oneLess':
      return x === c.n - 1;
    case 'tens':
      return Math.floor(x / 10) === c.d;
  }
}

/** Numbers on the board that satisfy every clue. A good riddle leaves exactly one. */
export function solve(board: number[], clues: Clue[]): number[] {
  return board.filter((x) => clues.every((c) => holds(c, x)));
}

/**
 * Number track ladder (reasoning rungs):
 * 1 board 1-10, "one more than" | 2 board 1-20, bigger/smaller | 3 a window of 20 within 50
 * 4 a window of 20 within 100, odd/even | 5 a window of 30, tens digit | 6-9 a window of 40, three clues or more
 */
export function generateRiddle(level: number, seed: number): RiddlePuzzle {
  const rng = createRng(seed);
  const l = Math.max(1, Math.min(level, RIDDLE_MAX_LEVEL));

  if (l === 1) {
    const board = range(1, 10);
    const answer = rng.int(2, 9);
    const clue: Clue = rng.next() < 0.5 ? { kind: 'oneMore', n: answer - 1 } : { kind: 'oneLess', n: answer + 1 };
    return { board, answer, clues: [clue] };
  }

  const [size, maxN] = l === 2 ? [20, 20] : l === 3 ? [20, 50] : l === 4 ? [20, 100] : l === 5 ? [30, 100] : [40, 100];
  const startMax = maxN - size + 1;
  const start = l === 2 ? 1 : rng.int(1, startMax);
  const board = range(start, start + size - 1);
  const answer = rng.int(board[1], board[board.length - 2]);

  const pool = candidateClues(answer, board, l, rng);
  const clues: Clue[] = [];
  let left = board;
  for (const c of pool) {
    const next = left.filter((x) => holds(c, x));
    if (next.length < left.length) {
      clues.push(c);
      left = next;
    }
    if (left.length === 1) break;
  }
  // Safety net: if the pool was not enough, tighten the bounds (replacing any looser bound
  // of the same kind, so a riddle never says "bigger than 14" and "bigger than 15").
  if (left.length > 1) {
    const others = left.filter((x) => x !== answer);
    const below = others.filter((x) => x < answer);
    const above = others.filter((x) => x > answer);
    if (below.length) setBound(clues, { kind: 'gt', n: Math.max(...below) });
    if (above.length) setBound(clues, { kind: 'lt', n: Math.min(...above) });
  }
  // Read naturally: bounds first, then digit facts.
  const order: Clue['kind'][] = ['gt', 'lt', 'tens', 'endsIn', 'odd', 'even'];
  clues.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  return { board, answer, clues };
}

function candidateClues(answer: number, board: number[], l: number, rng: Rng): Clue[] {
  const lo = board[0];
  const hi = board[board.length - 1];
  const parity: Clue = answer % 2 ? { kind: 'odd' } : { kind: 'even' };

  if (l >= 6) {
    // Greater depth: no single pair of digit facts gives it away, and the bounds are loose,
    // so the child has to combine three or more clues.
    const digit: Clue[] = rng.next() < 0.5 ? [{ kind: 'tens', d: Math.floor(answer / 10) }, parity] : [{ kind: 'endsIn', d: answer % 10 }];
    const gt: Clue = { kind: 'gt', n: rng.int(Math.max(lo, answer - 15), Math.max(lo, answer - 3)) };
    const lt: Clue = { kind: 'lt', n: rng.int(Math.min(hi, answer + 3), Math.min(hi, answer + 15)) };
    return [...rng.shuffle(digit), ...rng.shuffle([gt, lt])];
  }

  const gt: Clue = { kind: 'gt', n: rng.int(Math.max(lo, answer - 9), answer - 1) };
  const lt: Clue = { kind: 'lt', n: rng.int(answer + 1, Math.min(hi, answer + 9)) };
  const digit: Clue[] = [{ kind: 'endsIn', d: answer % 10 }];
  if (l >= 4) digit.push(parity);
  if (l >= 5) digit.push({ kind: 'tens', d: Math.floor(answer / 10) });
  return [gt, lt, ...rng.shuffle(digit)];
}

function setBound(clues: Clue[], bound: Clue) {
  const i = clues.findIndex((c) => c.kind === bound.kind);
  if (i >= 0) clues[i] = bound;
  else clues.push(bound);
}

function range(a: number, b: number): number[] {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}
