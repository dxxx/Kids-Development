import { useState } from 'react';
import type { GameProps, Lang, MiniGame, Mode } from '../../core/types';
import { fill } from '../shared';
import { generateRiddle, holds, RIDDLE_MAX_LEVEL, type Clue, type RiddlePuzzle } from './generate';

const TXT = {
  job: {
    en: 'Park the car in the right spot. Read the clues!',
    es: 'Aparca el coche en el lugar correcto. ¡Lee las pistas!',
    ro: 'Parchează mașina pe locul potrivit. Citește indiciile!',
  },
  question: { en: 'Which number am I?', es: '¿Qué número soy?', ro: 'Ce număr sunt?' },
};

const CLUE_TXT: Record<Clue['kind'], Record<Lang, string>> = {
  gt: { en: 'I am bigger than {n}.', es: 'Soy mayor que {n}.', ro: 'Sunt mai mare decât {n}.' },
  lt: { en: 'I am smaller than {n}.', es: 'Soy menor que {n}.', ro: 'Sunt mai mic decât {n}.' },
  endsIn: { en: 'I end in {d}.', es: 'Termino en {d}.', ro: 'Mă termin cu {d}.' },
  odd: { en: 'I am odd.', es: 'Soy impar.', ro: 'Sunt impar.' },
  even: { en: 'I am even.', es: 'Soy par.', ro: 'Sunt par.' },
  oneMore: { en: 'I am one more than {n}.', es: 'Soy uno más que {n}.', ro: 'Sunt cu unu mai mult decât {n}.' },
  oneLess: { en: 'I am one less than {n}.', es: 'Soy uno menos que {n}.', ro: 'Sunt cu unu mai puțin decât {n}.' },
  tens: { en: 'My tens digit is {d}.', es: 'Mi cifra de las decenas es {d}.', ro: 'Cifra zecilor mele este {d}.' },
};

export function clueText(c: Clue, lang: Lang): string {
  return fill(CLUE_TXT[c.kind][lang], c as unknown as Record<string, number>);
}

function RiddleGame({ puzzle, lang, misses, onAttempt }: GameProps<RiddlePuzzle>) {
  const [tried, setTried] = useState<number[]>([]);
  const [parked, setParked] = useState<number | null>(null);
  // Hints: after 2 misses grey out spots that break the first clue, after 3 the first two clues.
  const hintClues = misses >= 3 ? puzzle.clues.slice(0, 2) : misses >= 2 ? puzzle.clues.slice(0, 1) : [];
  const cols = puzzle.board.length <= 10 ? 5 : 10;
  const style = { ['--cols' as string]: cols };

  return (
    <div className="riddle-game">
      <ul className="clues">
        {puzzle.clues.map((c, i) => (
          <li key={i}>{clueText(c, lang)}</li>
        ))}
      </ul>
      <div className="lot" style={style}>
        {puzzle.board.map((n) => {
          const out = tried.includes(n) || hintClues.some((c) => !holds(c, n));
          return (
            <button
              key={n}
              className={`spot ${out ? 'spot-out' : ''} ${parked === n ? 'spot-parked' : ''}`}
              disabled={tried.includes(n) || parked !== null}
              onClick={() => {
                const ok = n === puzzle.answer;
                if (ok) setParked(n);
                else setTried((t) => [...t, n]);
                onAttempt(ok);
              }}
            >
              {parked === n ? '🚗' : n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const riddleGame: MiniGame<RiddlePuzzle> = {
  id: 'riddle',
  track: 'number',
  emoji: '🅿️',
  title: { en: 'Number Riddles', es: 'Adivina el Número', ro: 'Ghicitori cu Numere' },
  maxLevel: RIDDLE_MAX_LEVEL,
  generate: generateRiddle,
  instruction: (_p: RiddlePuzzle, mode: Mode, lang: Lang) => (mode === 'job' ? TXT.job[lang] : TXT.question[lang]),
  speech: (p: RiddlePuzzle, mode: Mode, lang: Lang) =>
    [mode === 'job' ? TXT.job[lang] : TXT.question[lang], ...p.clues.map((c) => clueText(c, lang))].join(' '),
  Component: RiddleGame,
};
