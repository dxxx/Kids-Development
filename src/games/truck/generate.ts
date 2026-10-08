import { createRng } from '../../core/rng';

export interface TruckPuzzle {
  /** Tires the truck needs in total. */
  target: number;
  /** Tires already loaded at the start (shown, cannot be removed). */
  preload: number;
  /** Whether packs of ten are available (place value). */
  packs: boolean;
  /** For question mode: answer choices. */
  options: number[];
}

export const TRUCK_MAX_LEVEL = 6;

/**
 * Number track ladder mapping:
 * 1 to 10 | 2 to 20 with packs of ten | 3 to 50 | 4 to 100 | 5-6 already part loaded (count on, partition)
 */
export function generateTruck(level: number, seed: number): TruckPuzzle {
  const rng = createRng(seed);
  const l = Math.max(1, Math.min(level, TRUCK_MAX_LEVEL));
  const ranges: [number, number][] = [
    [2, 10],
    [11, 20],
    [21, 50],
    [51, 99],
    [20, 60],
    [30, 99],
  ];
  const [lo, hi] = ranges[l - 1];
  const target = rng.int(lo, hi);
  const packs = l >= 2;
  const preload = l >= 5 ? rng.int(Math.max(5, Math.floor(target / 4)), target - 5) : 0;

  // Distractors that catch real mistakes: off by one, off by ten, swapped digits.
  const candidates = new Set<number>();
  const swap = target >= 10 && target % 10 !== 0 ? Number(String(target).split('').reverse().join('')) : -1;
  for (const d of [swap, target + 1, target - 1, target + 10, target - 10, target + 2]) {
    if (d > 0 && d !== target && d <= 120) candidates.add(d);
  }
  const distractors = rng.shuffle([...candidates]).slice(0, 2);
  const options = rng.shuffle([target, ...distractors]);
  return { target, preload, packs, options };
}
