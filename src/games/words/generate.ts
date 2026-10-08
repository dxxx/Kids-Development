import { createRng } from '../../core/rng';
import type { Lang } from '../../core/types';
import { WORDS, type Word } from './data';

export interface WordsPuzzle {
  word: Word;
  from: Lang;
  to: Lang;
  showEmoji: boolean;
  /** Words in the target language. */
  options: string[];
  answer: string;
}

export const WORDS_MAX_LEVEL = 5;

/**
 * Language track ladder:
 * 1 English to Spanish, 2 choices, picture | 2 English to Spanish or Romanian, 3 choices, picture
 * 3 same without the picture | 4 Spanish or Romanian back to English, 4 choices
 * 5 Spanish to Romanian or Romanian to Spanish, 4 choices
 */
export function generateWords(level: number, seed: number): WordsPuzzle {
  const rng = createRng(seed);
  const l = Math.max(1, Math.min(level, WORDS_MAX_LEVEL));
  const plan: { from: Lang; to: Lang; n: number; pic: boolean } = (() => {
    switch (l) {
      case 1:
        return { from: 'en', to: 'es', n: 2, pic: true };
      case 2:
        return { from: 'en', to: rng.pick(['es', 'ro'] as Lang[]), n: 3, pic: true };
      case 3:
        return { from: 'en', to: rng.pick(['es', 'ro'] as Lang[]), n: 3, pic: false };
      case 4:
        return { from: rng.pick(['es', 'ro'] as Lang[]), to: 'en', n: 4, pic: false };
      default: {
        const from = rng.pick(['es', 'ro'] as Lang[]);
        return { from, to: from === 'es' ? 'ro' : 'es', n: 4, pic: false };
      }
    }
  })();

  const [word, ...rest] = rng.shuffle(WORDS);
  const others = rest.filter((w) => w.text[plan.to] !== word.text[plan.to]).slice(0, plan.n - 1);
  const answer = word.text[plan.to];
  return {
    word,
    from: plan.from,
    to: plan.to,
    showEmoji: plan.pic,
    answer,
    options: rng.shuffle([answer, ...others.map((w) => w.text[plan.to])]),
  };
}
