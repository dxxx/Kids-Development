import type { ComponentType } from 'react';

export type Lang = 'en' | 'es' | 'ro';
export const LANGS: Lang[] = ['en', 'es', 'ro'];

/** Text in all three languages. English is the base and is always present. */
export type Text3 = Record<Lang, string>;

/** A skill track has its own level ladder (see docs/RESEARCH_UK_YEAR1_YEAR2.md). */
export type TrackId = 'number' | 'logic' | 'language';

/** Job = "the truck needs 8 tires". Question = "how many tires?". */
export type Mode = 'job' | 'question';

/** How a single round ended. */
export type Outcome = 'clean' | 'helped' | 'abandoned';

export interface GameProps<P> {
  puzzle: P;
  mode: Mode;
  lang: Lang;
  /** Misses so far this round. 2 = show a hint, 3+ = simplify. */
  misses: number;
  /** Report an attempt. The shell counts misses and ends the round on a correct one. */
  onAttempt: (correct: boolean) => void;
}

/**
 * The contract every mini-game follows. The trip engine only reads these
 * fields; games know nothing about levels, trips or each other.
 */
export interface MiniGame<P = any> {
  id: string;
  track: TrackId;
  emoji: string;
  title: Text3;
  /** Highest track level this game has content for. */
  maxLevel: number;
  /** Pure: same level + seed always gives the same puzzle. */
  generate: (level: number, seed: number) => P;
  /** The instruction shown at the top of the screen. */
  instruction: (puzzle: P, mode: Mode, lang: Lang) => string;
  /** What the voice reads aloud, if different from the shown instruction. */
  speech?: (puzzle: P, mode: Mode, lang: Lang) => string;
  Component: ComponentType<GameProps<P>>;
}
