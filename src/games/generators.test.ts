import { describe, expect, it } from 'vitest';
import { generatePattern, PATTERN_MAX_LEVEL } from './pattern/generate';
import { generateRiddle, RIDDLE_MAX_LEVEL, solve } from './riddle/generate';
import { generateTruck, TRUCK_MAX_LEVEL } from './truck/generate';
import { generateWords, WORDS_MAX_LEVEL } from './words/generate';

const SEEDS = Array.from({ length: 400 }, (_, i) => i * 7919 + 1);
const levels = (max: number) => Array.from({ length: max }, (_, i) => i + 1);

describe('truck', () => {
  it('produces valid puzzles at every level', () => {
    for (const l of levels(TRUCK_MAX_LEVEL)) {
      for (const s of SEEDS) {
        const p = generateTruck(l, s);
        expect(p.target).toBeGreaterThan(0);
        expect(p.preload).toBeLessThan(p.target);
        expect(p.options).toContain(p.target);
        expect(new Set(p.options).size).toBe(p.options.length);
        expect(p.options.length).toBe(3);
        expect(p.options.every((o) => o > 0)).toBe(true);
      }
    }
  });
  it('level 1 stays within 10 and has no packs', () => {
    for (const s of SEEDS) {
      const p = generateTruck(1, s);
      expect(p.target).toBeLessThanOrEqual(10);
      expect(p.packs).toBe(false);
    }
  });
  it('is deterministic', () => {
    expect(generateTruck(4, 99)).toEqual(generateTruck(4, 99));
  });
});

describe('pattern', () => {
  it('the answer fits the gap and appears among the options', () => {
    for (const l of levels(PATTERN_MAX_LEVEL)) {
      for (const s of SEEDS) {
        const p = generatePattern(l, s);
        expect(p.items[p.gap]).toBeNull();
        expect(p.items.filter((x) => x === null)).toHaveLength(1);
        expect(p.options).toContain(p.answer);
        expect(new Set(p.options).size).toBe(p.options.length);
      }
    }
  });
  it('number patterns are arithmetic sequences around the gap', () => {
    for (const l of [5, 6, 7]) {
      for (const s of SEEDS) {
        const p = generatePattern(l, s);
        const full = p.items.map((x, i) => Number(i === p.gap ? p.answer : x));
        const step = full[1] - full[0];
        full.forEach((v, i) => expect(v).toBe(full[0] + i * step));
        expect(full.every((v) => v >= 0)).toBe(true);
      }
    }
  });
});

describe('riddle', () => {
  it('every riddle has exactly one answer on the board', () => {
    for (const l of levels(RIDDLE_MAX_LEVEL)) {
      for (const s of SEEDS) {
        const p = generateRiddle(l, s);
        expect(p.board).toContain(p.answer);
        expect(solve(p.board, p.clues)).toEqual([p.answer]);
      }
    }
  });
  it('never repeats a kind of clue', () => {
    for (const l of levels(RIDDLE_MAX_LEVEL)) {
      for (const s of SEEDS) {
        const kinds = generateRiddle(l, s).clues.map((c) => c.kind);
        expect(new Set(kinds).size).toBe(kinds.length);
      }
    }
  });
  it('higher levels use more clues on average', () => {
    const avg = (l: number) => SEEDS.reduce((a, s) => a + generateRiddle(l, s).clues.length, 0) / SEEDS.length;
    expect(avg(6)).toBeGreaterThan(avg(2));
  });
});

describe('words', () => {
  it('the answer is in the target language and the options are distinct', () => {
    for (const l of levels(WORDS_MAX_LEVEL)) {
      for (const s of SEEDS) {
        const p = generateWords(l, s);
        expect(p.from).not.toBe(p.to);
        expect(p.answer).toBe(p.word.text[p.to]);
        expect(p.options).toContain(p.answer);
        expect(new Set(p.options).size).toBe(p.options.length);
      }
    }
  });
});
