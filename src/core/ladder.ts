import type { TrackId } from './types';

/** Plain-English level descriptions for the parent corner. Mirrors docs/RESEARCH_UK_YEAR1_YEAR2.md. */
export const LADDER: Record<TrackId, { name: string; levels: string[] }> = {
  number: {
    name: 'Number and place value',
    levels: [
      'Numbers to 10 (Year 1 autumn)',
      'Numbers to 20, packs of ten (Year 1 spring)',
      'Numbers to 50, tens and ones (Year 1 spring)',
      'Numbers to 100 (Year 1 summer)',
      'Part-loaded trucks: counting on, partitioning (Year 2 autumn)',
      'Two-digit counting on from any number (Year 2)',
      'Riddles with three clues, odd and even (end of KS1 expected)',
      'Riddles needing every clue (greater depth)',
      'Deep reasoning riddles (greater depth stretch)',
    ],
  },
  logic: {
    name: 'Patterns and logic',
    levels: [
      'AB patterns',
      'ABC and AAB patterns',
      'ABB and AABB patterns',
      'Longer patterns, gap in the middle',
      'Counting in 2s, 5s, 10s (Year 1 summer / Year 2)',
      'Counting in 3s, 10s from any number (Year 2)',
      'Counting backwards, gap anywhere (greater depth)',
    ],
  },
  language: {
    name: 'Three languages',
    levels: [
      'English to Spanish with pictures, 2 choices',
      'English to Spanish or Romanian with pictures',
      'English to Spanish or Romanian, no pictures',
      'Spanish or Romanian back to English',
      'Spanish to Romanian and back',
    ],
  },
};
