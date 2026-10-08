import type { GameProps, Lang, MiniGame, Mode } from '../../core/types';
import { Choices } from '../shared';
import { generatePattern, PATTERN_MAX_LEVEL, type PatternPuzzle } from './generate';

const TXT = {
  job: {
    en: 'Finish the road so the car can drive.',
    es: 'Termina la carretera para que pase el coche.',
    ro: 'Termină drumul ca să poată trece mașina.',
  },
  next: { en: 'What comes next?', es: '¿Qué va después?', ro: 'Ce urmează?' },
  missing: { en: 'What is missing?', es: '¿Qué falta?', ro: 'Ce lipsește?' },
};

function PatternGame({ puzzle, misses, onAttempt }: GameProps<PatternPuzzle>) {
  return (
    <div className="pattern-game">
      <div className="road">
        {puzzle.items.map((v, i) => (
          <span key={i} className={`road-tile ${v === null ? 'road-gap' : ''}`}>
            {v ?? '?'}
          </span>
        ))}
      </div>
      <Choices
        big
        options={puzzle.options.map((o) => ({ id: o, label: o }))}
        answerId={puzzle.answer}
        misses={misses}
        onAttempt={onAttempt}
      />
    </div>
  );
}

export const patternGame: MiniGame<PatternPuzzle> = {
  id: 'pattern',
  track: 'logic',
  emoji: '🛣️',
  title: { en: 'Pattern Road', es: 'Carretera de Patrones', ro: 'Drumul Modelelor' },
  maxLevel: PATTERN_MAX_LEVEL,
  generate: generatePattern,
  instruction: (p: PatternPuzzle, mode: Mode, lang: Lang) => {
    if (mode === 'job') return TXT.job[lang];
    return p.gap === p.items.length - 1 ? TXT.next[lang] : TXT.missing[lang];
  },
  Component: PatternGame,
};
