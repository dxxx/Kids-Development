import type { Rng } from './rng';
import type { MiniGame, TrackId } from './types';

export type SkillMix = Record<TrackId, number>;

/** Default from the design doc: logic and maths first, language second. */
export const DEFAULT_MIX: SkillMix = { number: 45, logic: 30, language: 25 };

export const GAMES_PER_TRIP = 3;
export const ROUNDS_PER_GAME = 3;

/**
 * Pick the games for one trip.
 * - weighted by the skill mix
 * - no game twice in a trip
 * - the first game is never the last game of the previous trip
 */
export function planTrip(games: MiniGame[], mix: SkillMix, rng: Rng, lastGameId?: string): MiniGame[] {
  const pool = [...games];
  const picked: MiniGame[] = [];
  const count = Math.min(GAMES_PER_TRIP, pool.length);

  while (picked.length < count) {
    const candidates = pool.filter((g) => !(picked.length === 0 && g.id === lastGameId && pool.length > 1));
    const weights = candidates.map((g) => Math.max(1, mix[g.track]) / games.filter((x) => x.track === g.track).length);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rng.next() * total;
    let chosen = candidates[candidates.length - 1];
    for (let i = 0; i < candidates.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        chosen = candidates[i];
        break;
      }
    }
    picked.push(chosen);
    pool.splice(pool.indexOf(chosen), 1);
  }
  return picked;
}
