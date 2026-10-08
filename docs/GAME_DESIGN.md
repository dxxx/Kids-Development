# Animal Rally — Game Design Document

A web game for kids around age 4 to 7 that builds logical thinking, math, reading and
language skills through short, fun trips with a crew of animals in a rally car.

Status: brainstorm complete, version 1 not yet built.

---

## 1. Who it is for

Primary player: a 5 year old who

- reads fluently (reading since age 2)
- speaks English, Romanian and Spanish, knows the alphabet in all three
- counts to 500, exact arithmetic level unknown (the game will find it)
- plays alone on a tablet
- loves cars, animals and silly animated crews (Madagascar, Boss Baby, Rio, Minions)

Secondary players: any kid 4 to 7, including kids who do not read yet.
This is why every instruction is spoken aloud even though text is shown.

Parent: wants logic and math first, language second, memory and spatial third.
Allows up to one hour a day.

## 2. Theme

An original crew of animals drives a rally car around the world.
Original characters only. No characters, names or art from existing films.

Crew (working names, all replaceable):

| Animal | Personality |
|---|---|
| Lion | the driver, brave and a little clumsy |
| Zebra | the navigator, loves maps and patterns |
| Hippo | the mechanic, loves counting parts |
| Lemur | the tiny bossy leader, gives orders, always silly |
| Parrot | speaks all three languages, switches without warning |

World stops: Jungle, Beach, City, Desert, Snow, Farm, Space (later).
Each stop has parking spots that fill with unlocked animals and vehicles.

## 3. Core loop

1. Tap the car. Voice says "Let's go!"
2. A **trip**: 3 to 4 mini-games in a row, about 2 minutes each.
3. The car drives to the next spot on the map. Something is unlocked
   (a sticker, an animal, a vehicle, a car decoration).
4. A **pit stop**: about 1 minute of free play with no learning goal
   (decorate the car, feed the animals, honk the horn). Resets attention.
5. Next trip, or "Done for now" screen.

A trip is about 10 to 12 minutes. An hour is 4 to 5 trips with pit stops.

## 4. Session shape over an hour

- Trip 1: warm-up at the current level
- Trips 2 and 3: push a bit harder
- Trips 4 and 5: ease off, end on a win
- Never the same mini-game twice in a row
- Over an hour every skill area is touched

Skill mix by default (parent adjustable):

| Area | Share |
|---|---|
| Logic and math | 60% |
| Reading and language | 25% |
| Memory and spatial | 15% |

Daily limit: parent-set, default 60 minutes. At the limit the car
"parks for the night" with a sunset animation. The child is never told
they lost or were cut off.

## 5. Adaptive difficulty

Each skill tracks its own level. A child can be level 12 in numbers and
level 3 in mazes. No skill is held back by another.

Rules:

- 3 correct in a row at a level: move up
- 2 wrong in a row at a level: move down, with hints turned on
- First session runs a quick, hidden placement by starting each skill
  mid-range and moving fast in both directions
- No visible scores, stars or levels for the child. Progress is shown
  as the map, the garage and the crew.

Wrong answers get a gentle "try again" plus a hint. Never a buzzer,
never a red X, never a timer that punishes.

## 6. Skill tracks and mini-games

### 6.1 Logic

| Game | Idea | Levels |
|---|---|---|
| Pattern road | A line of cars or animals: red, blue, red, ? | 2-item repeat, 3-item, growing, mirrored |
| Odd one out | Four things, one does not belong | color, shape, category, two rules at once |
| Sort the trucks | Drag animals to the zoo truck or the farm truck | one rule, two rules, hidden rule |
| Gate rule | The gate lets some cars through. Work out the rule | color, size, number of wheels, combined |
| Who is in which car | Text clues: "The lion is not in the red car" | 2 clues, 3 clues, 4 with elimination |
| If then | "If the light is red the car stops. The light is red. What happens?" | one rule, two rules, negation |
| Order the story | Put 3 to 5 pictures of an event in order | 3 pictures, 4, 5 with a distractor |
| Maze | Drive to the gas station | simple, branches, keys and doors |

### 6.2 Math

Starting point for a child who counts to 500: skip the "count the bananas"
level unless placement says otherwise.

| Game | Idea | Levels |
|---|---|---|
| Skip counting | 2, 4, 6, ? then by 5, 10, 3, 4 | by 10, by 5, by 2, by 3, by 4 |
| Build the number | Hundreds, tens, ones blocks: build 347 | tens and ones, hundreds, reading a built number |
| Load the truck | Drag exactly N tires onto the truck | to 10, to 20, to 50 |
| Parking lot | Park in spot number N on a numbered board | to 20, to 100, to 500 |
| Number hops | Number line: start at 23, hop +5 | +1/-1, +10/-10, +5, mixed |
| Animal sums | "5 monkeys, 2 drive away, how many left?" | to 10, to 20, to 100 |
| Make the number | Drag coins or tires to total 14 | to 10, to 20, two ways |
| Fair sharing | Split 12 bananas among 3 lemurs | 2 groups, 3, 4, remainder |
| Equal groups | 3 cars with 4 wheels each, how many wheels | groups of 2, 5, 10, 3, 4 |
| Bigger group | Tap the bigger pile without counting | obvious, close, estimation |
| Closer to | Is 86 closer to 80 or 90? | tens, hundreds |
| Number riddle | "Bigger than 40, smaller than 50, ends in 3" | 2 clues, 3 clues |
| Clock and money | Read the clock, pay for gas | hours, half hours, coins |

### 6.3 Reading and language

Reading is a tool the child already has. Use it to go deeper.

| Game | Idea | Levels |
|---|---|---|
| Riddles | "I have stripes and I am not a tiger" | 1 clue, 2, 3 |
| Follow the map | "Go left at the tree, then straight" | 2 steps, 3, 4 |
| Silly sentence | "The hippo ate a car" or "The hippo ate a melon", which is right | obvious, subtle |
| Story strips | Read 3 sentences, order the pictures | 3, 4, 5 |
| Word ladder | CAT to COT to DOT, one letter per step | 2 steps, 3, 4 |
| Which sign | Four signs, read the one that matches the clue | short, longer |

### 6.4 Three languages

English is the base. Spanish and Romanian are full secondary languages.

| Game | Idea |
|---|---|
| Word family | dog, perro, câine belong together. Match them |
| Which language | A sign appears, tap the right flag |
| Translate the clue | Clue in Romanian, answer on an English sign |
| Odd language out | Three Spanish words and one English word |
| Parrot day | The parrot only speaks Spanish on this trip, instructions switch |

Spoken instructions in version 1: English. The content structure holds
all three languages from day one so Spanish and Romanian voice can be
switched on without rework.

### 6.5 Memory and spatial

| Game | Idea | Levels |
|---|---|---|
| Memory cards | Find matching animal pairs | 4 pairs, 6, 8 |
| What changed | A scene, then one thing changes | 1 change, 2, subtle |
| Simon crew | Animals make sounds in order, repeat it | 3, 4, 5, 6 |
| Shadow fit | Rotate the car part to fit the shadow | no rotate, 90, any |
| Copy the tower | Build the same block tower | 3 blocks, 5, mirrored |
| Left and right | "The car on the left of the zebra" | left/right, between, above/below |

## 7. Rewards

No points. Rewards are things that build:

- the map fills in as trips finish
- the garage fills with unlocked vehicles
- the crew gains new animals
- the car gains decorations the child chooses at pit stops
- stickers collected in a sticker book

## 8. Playing alone, safely

- every instruction spoken, also shown as text
- big touch targets, drag and tap only, no typing
- no ads, no links out, no purchases, no chat
- works offline once installed on the tablet
- no account, no personal data leaves the device in version 1

## 9. Parent corner

Behind an adult gate (hold 3 seconds, then answer a sum like 6 + 7).

- time played today and this week
- level per skill, with a short plain explanation
- what was practiced, what was missed most
- set daily limit
- adjust skill mix
- switch instruction language
- add or switch child profiles

## 10. Technical plan for version 1

- React web app, installable on the tablet (PWA), works offline
- no backend, local profiles stored on the device
- all game content as data files: one entry per language per item,
  so adding a game or a language is mostly adding data
- generated voice for instructions, swappable for recorded voice later
- a mini-game is a small component with a shared contract:
  it receives a level and reports correct or wrong, nothing else
- the trip engine picks games, levels and the mix; games do not know
  about each other

## 11. Build order

1. Skeleton: map, car, trip engine, pit stop, one profile
2. Four mini-games: number riddle, pattern road, word family (3 languages), maze
3. Adaptive levels and hidden placement
4. Voice for instructions
5. Parent corner with limit and skill levels
6. More mini-games, one or two per week, data first
7. Spanish and Romanian spoken instructions
8. Later: cloud profiles so other families can play from a link

## 12. Open questions

- exact arithmetic level: found by placement in the first session
- recorded parent voice or generated voice long term
- art style: flat and bright, decided when the first screens are drawn

---

## 13. Interaction principles (from docs/RESEARCH_ENGAGEMENT.md)

Added after researching engagement for a child who may have autistic traits,
follows instructions in games but does not like answering people.

1. **Questions when engaged, jobs when not.** Every mini-game has a job form
   ("The truck needs 8 tires") and a question form ("How many tires?").
   New or harder content always starts as a job. Questions are used on a run
   of successes. After a miss or an early exit, the next round is a job.
2. **Nobody is waiting.** No timers, no nagging, no "are you still there".
   Silence is fine.
3. **Wrong is "not yet".** Wrong pieces slide back, no failure sound, no red
   X. Two misses: a hint fades in. Three misses: the job simplifies.
4. **Choice everywhere.** Next stop, crew member, car, colour, and the right
   to leave a mini-game by tapping the car with no penalty.
5. **Same layout every time.** Scene in the middle, car button bottom left,
   job shown as a picture plus one short line at the top. Soft sounds, no
   sudden effects, sound and motion reducible in the parent corner.
6. **Discover first, name later.** New ideas arrive as puzzles solved by
   trying. Words and symbols are shown afterwards, never asked about first.
7. **Interests on the surface, skills underneath.** Cars and animals in
   every scene, rotated so no theme wears out.
8. **Reading track is comprehension only.** Follow written instructions, act
   on a sentence, order a story, match text to picture. No letter drills.
9. **A bridge to people.** The crew narrates ("I see three red cars") rather
   than interrogates. Later, a tap lets him choose a line to "say" back.
   The parent corner suggests one shared activity after a session, phrased
   as something to do together, not a question to answer.
10. **Watch engagement, not scores.** The parent corner shows early exits,
    time after a hint, repeated game choices, and session length versus
    difficulty.
