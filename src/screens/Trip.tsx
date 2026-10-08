import { useEffect, useMemo, useRef, useState } from 'react';
import { applyOutcome, chooseMode, outcomeFor } from '../core/adaptive';
import { t, UI } from '../core/i18n';
import { createRng, randomSeed } from '../core/rng';
import type { Profile } from '../core/store';
import { planTrip, ROUNDS_PER_GAME } from '../core/trip';
import type { MiniGame, Mode } from '../core/types';
import { speak } from '../core/voice';
import { GAMES, trackMax } from '../games';

interface Round {
  game: MiniGame;
  level: number;
  mode: Mode;
  puzzle: unknown;
  key: string;
}

function makeRound(game: MiniGame, profile: Profile): Round {
  const track = profile.tracks[game.track];
  const level = Math.min(track.level, game.maxLevel);
  const seed = randomSeed();
  return { game, level, mode: chooseMode(track), puzzle: game.generate(level, seed), key: `${game.id}-${seed}` };
}

/**
 * Runs one trip: a few mini-games, a few rounds each.
 * Owns miss counting, the adaptive update, the celebration and the exit button.
 */
export function Trip({
  profile,
  update,
  onFinished,
}: {
  profile: Profile;
  update: (fn: (p: Profile) => Profile) => Profile;
  onFinished: (lastGameId: string) => void;
}) {
  const lang = profile.settings.lang;
  const games = useMemo(
    () => planTrip(GAMES, profile.settings.mix, createRng(randomSeed()), profile.progress.lastGameId),
    [] // plan once per trip
  );
  const [gameIndex, setGameIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<Round>(() => makeRound(games[0], profile));
  const [misses, setMisses] = useState(0);
  const [cheer, setCheer] = useState<string | null>(null);
  const finishing = useRef(false);

  const instruction = round.game.instruction(round.puzzle, round.mode, lang);
  const spoken = round.game.speech?.(round.puzzle, round.mode, lang) ?? instruction;

  useEffect(() => {
    speak(spoken, lang); // once per new round
  }, [round.key]);

  const record = (abandoned: boolean, missCount: number): Profile =>
    update((p) => {
      const track = p.tracks[round.game.track];
      const outcome = outcomeFor(missCount, abandoned);
      return {
        ...p,
        tracks: { ...p.tracks, [round.game.track]: applyOutcome(track, outcome, trackMax(round.game.track)) },
        log: [
          ...p.log,
          { at: new Date().toISOString(), game: round.game.id, level: round.level, mode: round.mode, outcome, misses: missCount },
        ],
      };
    });

  const advance = (p: Profile, skipGame: boolean) => {
    const lastRound = skipGame || roundIndex + 1 >= ROUNDS_PER_GAME;
    if (!lastRound) {
      setRoundIndex(roundIndex + 1);
      setRound(makeRound(round.game, p));
      setMisses(0);
      return;
    }
    if (gameIndex + 1 >= games.length) {
      finishing.current = true;
      onFinished(round.game.id);
      return;
    }
    setGameIndex(gameIndex + 1);
    setRoundIndex(0);
    setRound(makeRound(games[gameIndex + 1], p));
    setMisses(0);
  };

  const onAttempt = (correct: boolean) => {
    if (cheer || finishing.current) return;
    if (!correct) {
      setMisses((m) => m + 1);
      return;
    }
    const p = record(false, misses);
    const msg = t(UI.wellMore[Math.floor(Math.random() * UI.wellMore.length)], lang);
    setCheer(msg);
    speak(msg, lang);
    window.setTimeout(() => {
      setCheer(null);
      advance(p, false);
    }, 1600);
  };

  const leave = () => {
    if (cheer || finishing.current) return;
    advance(record(true, misses), true);
  };

  const Game = round.game.Component;
  return (
    <div className="screen trip">
      <div className="instruction">
        <span className="instruction-game">{round.game.emoji}</span>
        <p>{instruction}</p>
        <button className="btn-icon" onClick={() => speak(spoken, lang)} aria-label="say it again">
          🔊
        </button>
      </div>

      <div className="stage">
        <Game key={round.key} puzzle={round.puzzle} mode={round.mode} lang={lang} misses={misses} onAttempt={onAttempt} />
      </div>

      <div className="bottombar">
        <button className="btn-leave" onClick={leave} aria-label="next game" style={{ background: profile.progress.carColour }}>
          🚙
        </button>
        <div className="trip-dots">
          {games.map((g, i) => (
            <span key={g.id} className={`dot ${i < gameIndex ? 'dot-done' : ''} ${i === gameIndex ? 'dot-now' : ''}`}>
              {g.emoji}
            </span>
          ))}
        </div>
      </div>

      {cheer && (
        <div className="cheer">
          <div className="cheer-crew">🦁🦓🦛🐒🦜</div>
          <div className="cheer-text">{cheer}</div>
        </div>
      )}
    </div>
  );
}
