import { describe, expect, it } from 'vitest';
import { applyOutcome, chooseMode, newTrack, outcomeFor, PLACEMENT_ROUNDS, type TrackState } from './adaptive';
import { createRng } from './rng';
import { defaultProfile, parseProfile } from './store';
import { DEFAULT_MIX, GAMES_PER_TRIP, planTrip } from './trip';
import type { MiniGame } from './types';

const placed = (level: number): TrackState => ({ ...newTrack(level), rounds: PLACEMENT_ROUNDS, justMoved: false });

describe('rng', () => {
  it('is deterministic for a seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a.next(), a.int(1, 100), a.next()]).toEqual([b.next(), b.int(1, 100), b.next()]);
  });
  it('int stays in range', () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(3, 9);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(9);
    }
  });
});

describe('adaptive levels', () => {
  it('moves up after 3 clean rounds in normal play', () => {
    let s = placed(3);
    s = applyOutcome(s, 'clean', 9);
    s = applyOutcome(s, 'clean', 9);
    expect(s.level).toBe(3);
    s = applyOutcome(s, 'clean', 9);
    expect(s.level).toBe(4);
    expect(s.justMoved).toBe(true);
  });

  it('moves down after 2 struggling rounds', () => {
    let s = placed(4);
    s = applyOutcome(s, 'helped', 9);
    expect(s.level).toBe(4);
    s = applyOutcome(s, 'helped', 9);
    expect(s.level).toBe(3);
  });

  it('a clean round breaks a struggling streak', () => {
    let s = placed(4);
    s = applyOutcome(s, 'helped', 9);
    s = applyOutcome(s, 'clean', 9);
    s = applyOutcome(s, 'helped', 9);
    expect(s.level).toBe(4);
  });

  it('never goes below 1 or above the max', () => {
    let s = placed(1);
    for (let i = 0; i < 5; i++) s = applyOutcome(s, 'helped', 5);
    expect(s.level).toBe(1);
    s = placed(5);
    for (let i = 0; i < 9; i++) s = applyOutcome(s, 'clean', 5);
    expect(s.level).toBe(5);
  });

  it('placement rounds move a level after a single round', () => {
    let s = newTrack(3);
    s = applyOutcome(s, 'clean', 9);
    expect(s.level).toBe(4);
    s = applyOutcome(s, 'clean', 9);
    expect(s.level).toBe(5);
    s = applyOutcome(s, 'helped', 9);
    expect(s.level).toBe(4);
  });

  it('leaving a game early does not lower the level', () => {
    let s = placed(4);
    for (let i = 0; i < 4; i++) s = applyOutcome(s, 'abandoned', 9);
    expect(s.level).toBe(4);
  });

  it('counts outcomes correctly', () => {
    expect(outcomeFor(0, false)).toBe('clean');
    expect(outcomeFor(2, false)).toBe('helped');
    expect(outcomeFor(0, true)).toBe('abandoned');
  });
});

describe('job or question', () => {
  it('starts every new level as a job', () => {
    expect(chooseMode(newTrack(2))).toBe('job');
  });
  it('asks questions after two clean rounds', () => {
    expect(chooseMode({ ...placed(2), recent: ['clean', 'clean'] })).toBe('question');
  });
  it('drops back to a job after trouble or leaving', () => {
    expect(chooseMode({ ...placed(2), recent: ['clean', 'helped'] })).toBe('job');
    expect(chooseMode({ ...placed(2), recent: ['clean', 'abandoned'] })).toBe('job');
  });
});

describe('trip planner', () => {
  const fake = (id: string, track: MiniGame['track']) => ({ id, track }) as MiniGame;
  const games = [fake('a', 'number'), fake('b', 'number'), fake('c', 'logic'), fake('d', 'language')];

  it('never repeats a game inside a trip and never opens with the last game played', () => {
    for (let seed = 0; seed < 500; seed++) {
      const trip = planTrip(games, DEFAULT_MIX, createRng(seed), 'c');
      expect(trip).toHaveLength(GAMES_PER_TRIP);
      expect(new Set(trip.map((g) => g.id)).size).toBe(trip.length);
      expect(trip[0].id).not.toBe('c');
    }
  });

  it('respects the skill mix weights over many trips', () => {
    const counts: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 };
    const mix = { number: 0, logic: 100, language: 0 };
    for (let seed = 0; seed < 300; seed++) counts[planTrip(games, mix, createRng(seed))[0].id]++;
    expect(counts.c).toBeGreaterThan(250);
  });
});

describe('profile storage', () => {
  it('falls back to defaults on bad data', () => {
    expect(parseProfile('not json').version).toBe(1);
    expect(parseProfile(null).tracks.number.level).toBe(defaultProfile().tracks.number.level);
  });
  it('keeps saved values and fills in new fields', () => {
    const saved = defaultProfile();
    saved.tracks.logic.level = 6;
    saved.settings.lang = 'ro';
    const raw = JSON.parse(JSON.stringify(saved));
    delete raw.settings.reduceMotion;
    const p = parseProfile(JSON.stringify(raw));
    expect(p.tracks.logic.level).toBe(6);
    expect(p.settings.lang).toBe('ro');
    expect(p.settings.reduceMotion).toBe(false);
  });
});
