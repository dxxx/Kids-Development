import { newTrack, type TrackState } from './adaptive';
import { DEFAULT_MIX, type SkillMix } from './trip';
import type { Lang, TrackId } from './types';

/**
 * Everything the game remembers, in one JSON object in localStorage.
 * Kept behind load/save so it can move to IndexedDB or a server later.
 */
export interface Profile {
  version: 1;
  name: string;
  tracks: Record<TrackId, TrackState>;
  settings: {
    lang: Lang;
    voice: boolean;
    reduceMotion: boolean;
    dailyLimitMinutes: number;
    mix: SkillMix;
  };
  progress: {
    trips: number;
    stop: number;
    crew: number;
    carColour: string;
    lastGameId?: string;
  };
  /** Seconds played per day, keyed by YYYY-MM-DD. */
  playtime: Record<string, number>;
  /** Small rolling log for the parent corner. */
  log: { at: string; game: string; level: number; mode: string; outcome: string; misses: number }[];
}

const KEY = 'animal-rally.profile.v1';
const LOG_CAP = 300;

/** Day-one placement from the curriculum research; the adaptive engine corrects it fast. */
export const START_LEVELS: Record<TrackId, number> = { number: 3, logic: 2, language: 1 };

export function defaultProfile(): Profile {
  return {
    version: 1,
    name: 'Player 1',
    tracks: {
      number: newTrack(START_LEVELS.number),
      logic: newTrack(START_LEVELS.logic),
      language: newTrack(START_LEVELS.language),
    },
    settings: { lang: 'en', voice: true, reduceMotion: false, dailyLimitMinutes: 60, mix: { ...DEFAULT_MIX } },
    progress: { trips: 0, stop: 0, crew: 5, carColour: '#e4572e' },
    playtime: {},
    log: [],
  };
}

/** Merge stored data over defaults so new fields added later never crash an old profile. */
export function parseProfile(raw: string | null): Profile {
  const base = defaultProfile();
  if (!raw) return base;
  try {
    const p = JSON.parse(raw) as Partial<Profile>;
    if (p.version !== 1) return base;
    return {
      ...base,
      ...p,
      tracks: { ...base.tracks, ...p.tracks },
      settings: { ...base.settings, ...p.settings, mix: { ...base.settings.mix, ...p.settings?.mix } },
      progress: { ...base.progress, ...p.progress },
      playtime: p.playtime ?? {},
      log: Array.isArray(p.log) ? p.log : [],
    };
  } catch {
    return base;
  }
}

export function loadProfile(): Profile {
  try {
    return parseProfile(localStorage.getItem(KEY));
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...p, log: p.log.slice(-LOG_CAP) }));
  } catch {
    /* storage full or blocked: the game still works for this session */
  }
}

export function today(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function minutesToday(p: Profile): number {
  return Math.floor((p.playtime[today()] ?? 0) / 60);
}

export function isOverLimit(p: Profile): boolean {
  return minutesToday(p) >= p.settings.dailyLimitMinutes;
}
