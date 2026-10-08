# Architecture, version 0.1

Deliberately simple: a static single-page app, no server, no database. Expand
only once the game proves itself with real play.

## Runtime

```
Docker image (nginx:alpine, ~74 MB)
└── static files: index.html, one JS bundle, one CSS file, manifest, service worker
    └── runs entirely in the tablet's browser
        └── progress saved in the browser's localStorage
```

- Build: multi-stage Dockerfile. Stage one runs `npm ci`, the unit tests and
  the Vite build; a failing test fails the image build. Stage two copies only
  `dist/` into nginx.
- nginx: SPA fallback to `index.html`, year-long immutable cache for hashed
  assets, `no-cache` for `index.html`, `sw.js` and the manifest so updates
  reach the tablet, gzip, `/healthz`.
- Offline: a small service worker caches the shell and assets after first load.

## Code layout

```
src/
  core/            pure logic, no React
    types.ts       the mini-game contract
    rng.ts         seeded random, so every puzzle is reproducible
    adaptive.ts    per-track levels, placement, job vs question choice
    trip.ts        picks the games for a trip from the skill mix
    store.ts       profile load/save/migrate (localStorage)
    i18n.ts        interface text in en, es, ro; stops; crew
    voice.ts       browser speech, British English first
    ladder.ts      level descriptions for the parent corner
  games/
    index.ts       the registry: add a game here, nothing else changes
    shared.tsx     tap-to-choose grid with fade, glow hint, simplify
    truck/         Load the Truck (number track)
    riddle/        Number Riddles (number track)
    pattern/       Pattern Road (logic track)
    words/         Parrot Words (language track)
  screens/         Home, Trip, PitStop, Sunset, Parent, HoldButton
  App.tsx          screen switching, play-time tracking, synchronous profile updates
```

## The mini-game contract

Each game folder has a pure `generate.ts` (level + seed to puzzle, unit tested)
and an `index.tsx` exporting a `MiniGame`:

- `id`, `track`, `emoji`, `title` in three languages, `maxLevel`
- `generate(level, seed)`
- `instruction(puzzle, mode, lang)` and optional `speech(...)`
- `Component`, which receives `puzzle`, `mode` (job or question), `lang`,
  `misses`, and calls `onAttempt(correct)`

Games never know about levels, trips or each other. The trip runner owns miss
counting, the adaptive update, celebrations and the leave button.

## Adaptive rules

- One level per track (number, logic, language).
- First 6 rounds on a track are placement: one clean round moves up, one
  struggling round moves down.
- After that: 3 clean rounds in a row move up, 2 struggling rounds move down.
- Leaving a game never lowers the level.
- New level or recent trouble: job form. Two clean rounds: question form.

## What is deliberately not here yet

Server, accounts, cloud sync, IndexedDB event log, recorded voice, real art,
canvas games, analytics. Each has a clear seam: `store.ts` for storage,
`voice.ts` for audio, the game registry for new games.
