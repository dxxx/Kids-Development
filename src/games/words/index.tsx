import type { GameProps, Lang, MiniGame, Mode } from '../../core/types';
import { speak } from '../../core/voice';
import { Pic } from '../../screens/Pic';
import { Choices, fill } from '../shared';
import { LANG_NAMES } from './data';
import { generateWords, WORDS_MAX_LEVEL, type WordsPuzzle } from './generate';

const TXT = {
  job: {
    en: 'Help the parrot find "{word}" in {lang}.',
    es: 'Ayuda al loro a encontrar "{word}" en {lang}.',
    ro: 'Ajută papagalul să găsească "{word}" în {lang}.',
  },
  question: {
    en: 'Which one is "{word}" in {lang}?',
    es: '¿Cuál es "{word}" en {lang}?',
    ro: 'Care este "{word}" în {lang}?',
  },
};

function WordsGame({ puzzle, misses, onAttempt }: GameProps<WordsPuzzle>) {
  const source = puzzle.word.text[puzzle.from];
  return (
    <div className="words-game">
      <button className="word-card" onClick={() => speak(source, puzzle.from)} aria-label="hear the word">
        <span className="parrot">🦜</span>
        {puzzle.showEmoji && <Pic id={`word-${puzzle.word.text.en}`} emoji={puzzle.word.emoji} className="word-pic" alt="" />}
        <span className="word-text">{source}</span>
        <span className="word-speaker">🔊</span>
      </button>
      <Choices
        options={puzzle.options.map((w) => ({ id: w, label: w }))}
        answerId={puzzle.answer}
        misses={misses}
        onAttempt={(ok) => {
          if (ok) speak(puzzle.answer, puzzle.to);
          onAttempt(ok);
        }}
      />
    </div>
  );
}

export const wordsGame: MiniGame<WordsPuzzle> = {
  id: 'words',
  track: 'language',
  emoji: '🦜',
  title: { en: 'Parrot Words', es: 'Palabras del Loro', ro: 'Cuvintele Papagalului' },
  maxLevel: WORDS_MAX_LEVEL,
  generate: generateWords,
  instruction: (p: WordsPuzzle, mode: Mode, lang: Lang) =>
    fill(mode === 'job' ? TXT.job[lang] : TXT.question[lang], {
      word: p.word.text[p.from],
      lang: LANG_NAMES[p.to][lang],
    }),
  Component: WordsGame,
};
