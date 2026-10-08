import { createRng } from '../../core/rng';

export interface PatternPuzzle {
  /** The road, with null where the gap is. */
  items: (string | null)[];
  gap: number;
  answer: string;
  options: string[];
}

export const PATTERN_MAX_LEVEL = 7;

const VEHICLES = ['🚗', '🚙', '🚕', '🚌', '🚜', '🚒', '🚓', '🏎️'];

/** Repeating units per level. Letters map to vehicles. */
const UNITS: Record<number, string[]> = {
  1: ['AB'],
  2: ['ABC', 'AAB'],
  3: ['ABB', 'AABB', 'ABBC'],
  4: ['ABAC', 'ABCD', 'AABC'],
};

/**
 * Logic track ladder:
 * 1 AB | 2 ABC, AAB | 3 ABB, AABB | 4 longer units, gap in the middle
 * 5 count in 2s, 5s, 10s | 6 count in 3s, or 10s from any number | 7 count backwards, gap anywhere
 */
export function generatePattern(level: number, seed: number): PatternPuzzle {
  const rng = createRng(seed);
  const l = Math.max(1, Math.min(level, PATTERN_MAX_LEVEL));
  return l <= 4 ? shapePattern(l, rng) : numberPattern(l, rng);
}

function shapePattern(l: number, rng: ReturnType<typeof createRng>): PatternPuzzle {
  const unit = rng.pick(UNITS[l]);
  const letters = [...new Set(unit)];
  const pool = rng.shuffle(VEHICLES);
  const map = Object.fromEntries(letters.map((c, i) => [c, pool[i]]));
  const length = Math.max(7, unit.length * 2 + 2);
  const seq = Array.from({ length }, (_, i) => map[unit[i % unit.length]]);
  // Levels 1-3: gap at the end. Level 4: gap after the first full unit.
  const gap = l <= 3 ? length - 1 : rng.int(unit.length, length - 1);
  const answer = seq[gap];
  const inUse = letters.map((c) => map[c]).filter((v) => v !== answer);
  const extra = pool.slice(letters.length);
  const distractors = rng.shuffle([...inUse, ...extra]).slice(0, l === 1 ? 1 : 2);
  // Always include at least one in-use symbol so the choice needs the pattern, not novelty.
  if (inUse.length && !distractors.some((d) => inUse.includes(d))) distractors[0] = inUse[0];
  return { items: seq.map((v, i) => (i === gap ? null : v)), gap, answer, options: rng.shuffle([answer, ...distractors]) };
}

function numberPattern(l: number, rng: ReturnType<typeof createRng>): PatternPuzzle {
  let step: number;
  let start: number;
  if (l === 5) {
    step = rng.pick([2, 5, 10]);
    start = step * rng.int(0, 4);
  } else if (l === 6) {
    if (rng.next() < 0.5) {
      step = 3;
      start = 3 * rng.int(0, 5);
    } else {
      step = 10;
      start = rng.int(1, 40);
    }
  } else {
    step = -rng.pick([2, 5, 10]);
    start = Math.abs(step) * rng.int(8, 12) + (Math.abs(step) === 10 ? rng.int(0, 9) : 0);
  }
  const length = 6;
  const seq = Array.from({ length }, (_, i) => start + i * step);
  const gap = l === 5 ? length - 1 : rng.int(2, length - 1);
  const answer = seq[gap];
  const s = Math.abs(step);
  const cands = new Set([answer + 1, answer - 1, answer + s, answer - s, answer + 10, answer - 10]);
  cands.delete(answer);
  const distractors = rng.shuffle([...cands].filter((n) => n >= 0)).slice(0, 2);
  return {
    items: seq.map((v, i) => (i === gap ? null : String(v))),
    gap,
    answer: String(answer),
    options: rng.shuffle([answer, ...distractors].map(String)),
  };
}
