import type { Mode, Outcome } from './types';

/** Per-track adaptive state, stored in the profile. */
export interface TrackState {
  level: number;
  /** Total rounds played on this track. The first few are placement rounds. */
  rounds: number;
  /** Most recent outcomes, newest last, capped. */
  recent: Outcome[];
  /** True right after a level change, so the next round is a job. */
  justMoved: boolean;
}

export const PLACEMENT_ROUNDS = 6;
const UP_AFTER = 3;
const DOWN_AFTER = 2;
const RECENT_CAP = 10;

export function newTrack(level = 1): TrackState {
  return { level, rounds: 0, recent: [], justMoved: true };
}

function tailCount(recent: Outcome[], match: (o: Outcome) => boolean): number {
  let n = 0;
  for (let i = recent.length - 1; i >= 0 && match(recent[i]); i--) n++;
  return n;
}

/**
 * Apply a round result.
 * - Normal play: 3 clean rounds in a row move up, 2 struggling rounds in a row move down.
 * - Placement (first rounds on a track): move after a single round, so the game finds the
 *   right level quickly without the child noticing a test.
 * - Abandoned rounds never move the level down on their own; they only make the next round a job.
 */
export function applyOutcome(state: TrackState, outcome: Outcome, maxLevel: number): TrackState {
  const recent = [...state.recent, outcome].slice(-RECENT_CAP);
  const placing = state.rounds < PLACEMENT_ROUNDS;
  const upNeed = placing ? 1 : UP_AFTER;
  const downNeed = placing ? 1 : DOWN_AFTER;

  // `recent` is cleared on every level change, so it only holds rounds at this level.
  let level = state.level;
  if (tailCount(recent, (o) => o === 'clean') >= upNeed && level < maxLevel) level++;
  else if (tailCount(recent, (o) => o === 'helped') >= downNeed && level > 1) level--;

  const moved = level !== state.level;
  return { level, rounds: state.rounds + 1, recent: moved ? [] : recent, justMoved: moved };
}

/**
 * Questions when he is on a roll, jobs otherwise.
 * New level or recent trouble: job. Last two rounds clean: question.
 */
export function chooseMode(state: TrackState): Mode {
  if (state.justMoved) return 'job';
  const last2 = state.recent.slice(-2);
  return last2.length === 2 && last2.every((o) => o === 'clean') ? 'question' : 'job';
}

export function outcomeFor(misses: number, abandoned: boolean): Outcome {
  if (abandoned) return 'abandoned';
  return misses === 0 ? 'clean' : 'helped';
}
