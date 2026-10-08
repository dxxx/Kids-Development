import type { MiniGame, TrackId } from '../core/types';
import { patternGame } from './pattern';
import { riddleGame } from './riddle';
import { truckGame } from './truck';
import { wordsGame } from './words';

/** Register new mini-games here. Nothing else needs to change. */
export const GAMES: MiniGame[] = [truckGame, riddleGame, patternGame, wordsGame];

export function trackMax(track: TrackId): number {
  return Math.max(1, ...GAMES.filter((g) => g.track === track).map((g) => g.maxLevel));
}
