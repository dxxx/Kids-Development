import { useState } from 'react';
import type { GameProps, Lang, MiniGame, Mode } from '../../core/types';
import { Choices, fill } from '../shared';
import { generateTruck, TRUCK_MAX_LEVEL, type TruckPuzzle } from './generate';

const TXT = {
  job: {
    en: 'The truck needs {n} tires. Load them, then press Drive!',
    es: 'El camión necesita {n} ruedas. Cárgalas y pulsa ¡Arranca!',
    ro: 'Camionul are nevoie de {n} roți. Încarcă-le, apoi apasă Pornește!',
  },
  jobPre: {
    en: 'The truck needs {n} tires. It already has {p}. Load the rest, then press Drive!',
    es: 'El camión necesita {n} ruedas. Ya tiene {p}. Carga las que faltan y pulsa ¡Arranca!',
    ro: 'Camionul are nevoie de {n} roți. Are deja {p}. Încarcă restul, apoi apasă Pornește!',
  },
  question: {
    en: 'How many tires are on the truck?',
    es: '¿Cuántas ruedas hay en el camión?',
    ro: 'Câte roți sunt în camion?',
  },
  drive: { en: 'Drive!', es: '¡Arranca!', ro: 'Pornește!' },
  one: { en: '+1 tire', es: '+1 rueda', ro: '+1 roată' },
  ten: { en: '+10 pack', es: '+10 paquete', ro: '+10 pachet' },
};

function Load({ tens, ones, removable, onRemove }: { tens: number; ones: number; removable?: boolean; onRemove?: (kind: 'ten' | 'one') => void }) {
  return (
    <>
      {Array.from({ length: tens }, (_, i) => (
        <button key={`t${i}`} className="pack" disabled={!removable} onClick={() => onRemove?.('ten')} aria-label="pack of ten tires">
          {'🛞'.repeat(10)}
        </button>
      ))}
      {Array.from({ length: ones }, (_, i) => (
        <button key={`o${i}`} className="tire" disabled={!removable} onClick={() => onRemove?.('one')} aria-label="tire">
          🛞
        </button>
      ))}
    </>
  );
}

function TruckGame({ puzzle, mode, lang, misses, onAttempt }: GameProps<TruckPuzzle>) {
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [driving, setDriving] = useState(false);

  if (mode === 'question') {
    return (
      <div className="truck-game">
        <div className="truck-bed">
          <div className="truck-load">
            <Load tens={Math.floor(puzzle.target / 10)} ones={puzzle.target % 10} />
          </div>
          <span className="truck-cab">🚚</span>
        </div>
        <Choices
          big
          options={puzzle.options.map((n) => ({ id: String(n), label: n }))}
          answerId={String(puzzle.target)}
          misses={misses}
          onAttempt={onAttempt}
        />
      </div>
    );
  }

  const loaded = puzzle.preload + tens * 10 + ones;
  const showCount = misses >= 2;

  return (
    <div className="truck-game">
      <div className={`truck-bed ${driving ? 'truck-drive' : ''}`}>
        <div className="truck-load">
          {puzzle.preload > 0 && (
            <span className="preload">
              <Load tens={Math.floor(puzzle.preload / 10)} ones={puzzle.preload % 10} />
            </span>
          )}
          <Load
            tens={tens}
            ones={ones}
            removable
            onRemove={(k) => (k === 'ten' ? setTens((v) => v - 1) : setOnes((v) => v - 1))}
          />
        </div>
        <span className="truck-cab">🚚</span>
        {showCount && <span className="truck-count">{loaded}</span>}
      </div>
      <div className="truck-controls">
        {puzzle.packs && (
          <button className="btn btn-supply" onClick={() => setTens((v) => v + 1)} disabled={loaded + 10 > 130}>
            {TXT.ten[lang]}
          </button>
        )}
        <button className="btn btn-supply" onClick={() => setOnes((v) => v + 1)} disabled={loaded >= 130}>
          {TXT.one[lang]}
        </button>
        <button
          className="btn btn-go"
          disabled={driving}
          onClick={() => {
            const ok = loaded === puzzle.target;
            if (ok) setDriving(true);
            onAttempt(ok);
          }}
        >
          {TXT.drive[lang]}
        </button>
      </div>
    </div>
  );
}

export const truckGame: MiniGame<TruckPuzzle> = {
  id: 'truck',
  track: 'number',
  emoji: '🚚',
  title: { en: 'Load the Truck', es: 'Carga el Camión', ro: 'Încarcă Camionul' },
  maxLevel: TRUCK_MAX_LEVEL,
  generate: generateTruck,
  instruction: (p: TruckPuzzle, mode: Mode, lang: Lang) =>
    mode === 'question'
      ? TXT.question[lang]
      : fill(p.preload ? TXT.jobPre[lang] : TXT.job[lang], { n: p.target, p: p.preload }),
  Component: TruckGame,
};
