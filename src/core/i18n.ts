import type { Lang, Text3 } from './types';

/** Interface text in all three languages. Game instructions live with each game. */
export const UI = {
  go: { en: "Let's go!", es: '¡Vamos!', ro: 'Hai să mergem!' },
  well: { en: 'Brilliant!', es: '¡Genial!', ro: 'Super!' },
  wellMore: [
    { en: 'Brilliant!', es: '¡Genial!', ro: 'Super!' },
    { en: 'You did it!', es: '¡Lo lograste!', ro: 'Ai reușit!' },
    { en: 'Great driving!', es: '¡Qué bien conduces!', ro: 'Ce bine conduci!' },
    { en: 'The crew is cheering!', es: '¡El equipo aplaude!', ro: 'Echipa te aplaudă!' },
  ],
  notYet: { en: 'Not yet. Try another one.', es: 'Todavía no. Prueba otra vez.', ro: 'Încă nu. Mai încearcă.' },
  pitStop: { en: 'Pit stop!', es: '¡Parada en boxes!', ro: 'Oprire la boxe!' },
  pickColour: { en: 'Pick a colour for the car', es: 'Elige un color para el coche', ro: 'Alege o culoare pentru mașină' },
  newFriend: { en: 'A new friend joined the crew!', es: '¡Un nuevo amigo se unió al equipo!', ro: 'Un prieten nou s-a alăturat echipei!' },
  drive: { en: 'Drive on', es: 'Seguir', ro: 'Mai departe' },
  arrived: { en: 'We arrived at', es: 'Llegamos a', ro: 'Am ajuns la' },
  parked: { en: 'The car is parked for the night. See you tomorrow!', es: 'El coche se queda aparcado esta noche. ¡Hasta mañana!', ro: 'Mașina doarme în parcare. Pe mâine!' },
  garage: { en: 'Crew', es: 'Equipo', ro: 'Echipa' },
  parent: { en: 'Grown-ups', es: 'Adultos', ro: 'Adulți' },
} satisfies Record<string, Text3 | Text3[]>;

export const STOPS: { emoji: string; photo: string; name: Text3 }[] = [
  { emoji: '🌴', photo: 'stop-jungle', name: { en: 'the Jungle', es: 'la Selva', ro: 'Junglă' } },
  { emoji: '🏖️', photo: 'stop-beach', name: { en: 'the Beach', es: 'la Playa', ro: 'Plajă' } },
  { emoji: '🏙️', photo: 'stop-city', name: { en: 'the City', es: 'la Ciudad', ro: 'Oraș' } },
  { emoji: '🌵', photo: 'stop-desert', name: { en: 'the Desert', es: 'el Desierto', ro: 'Deșert' } },
  { emoji: '🏔️', photo: 'stop-snow', name: { en: 'the Snow Mountains', es: 'las Montañas Nevadas', ro: 'Munții cu Zăpadă' } },
  { emoji: '🚜', photo: 'stop-farm', name: { en: 'the Farm', es: 'la Granja', ro: 'Fermă' } },
  { emoji: '🚀', photo: 'stop-space', name: { en: 'the Space Port', es: 'el Puerto Espacial', ro: 'Portul Spațial' } },
];

export interface CrewMember {
  emoji: string;
  photo: string;
  name: Text3;
}

/** Crew members unlocked one per trip. The first five are the starting crew. */
export const CREW: CrewMember[] = [
  { emoji: '🦁', photo: 'crew-lion', name: { en: 'Lion', es: 'León', ro: 'Leul' } },
  { emoji: '🦓', photo: 'crew-zebra', name: { en: 'Zebra', es: 'Cebra', ro: 'Zebra' } },
  { emoji: '🦛', photo: 'crew-hippo', name: { en: 'Hippo', es: 'Hipopótamo', ro: 'Hipopotamul' } },
  { emoji: '🐒', photo: 'crew-lemur', name: { en: 'Lemur', es: 'Lémur', ro: 'Lemurul' } },
  { emoji: '🦜', photo: 'crew-parrot', name: { en: 'Parrot', es: 'Loro', ro: 'Papagalul' } },
  { emoji: '🐘', photo: 'crew-elephant', name: { en: 'Elephant', es: 'Elefante', ro: 'Elefantul' } },
  { emoji: '🦒', photo: 'crew-giraffe', name: { en: 'Giraffe', es: 'Jirafa', ro: 'Girafa' } },
  { emoji: '🐧', photo: 'crew-penguin', name: { en: 'Penguin', es: 'Pingüino', ro: 'Pinguinul' } },
  { emoji: '🐢', photo: 'crew-tortoise', name: { en: 'Tortoise', es: 'Tortuga', ro: 'Țestoasa' } },
  { emoji: '🦊', photo: 'crew-fox', name: { en: 'Fox', es: 'Zorro', ro: 'Vulpea' } },
  { emoji: '🐼', photo: 'crew-panda', name: { en: 'Panda', es: 'Panda', ro: 'Panda' } },
  { emoji: '🐨', photo: 'crew-koala', name: { en: 'Koala', es: 'Koala', ro: 'Koala' } },
  { emoji: '🦘', photo: 'crew-kangaroo', name: { en: 'Kangaroo', es: 'Canguro', ro: 'Cangurul' } },
  { emoji: '🐙', photo: 'crew-octopus', name: { en: 'Octopus', es: 'Pulpo', ro: 'Caracatița' } },
  { emoji: '🦦', photo: 'crew-meerkat', name: { en: 'Meerkat', es: 'Suricata', ro: 'Suricata' } },
  { emoji: '🐬', photo: 'crew-dolphin', name: { en: 'Dolphin', es: 'Delfín', ro: 'Delfinul' } },
];
export const STARTING_CREW = 5;

export const CAR_COLOURS = ['#e4572e', '#2f8f6b', '#3a7bd5', '#f2b134', '#8e5ad6', '#ef6fa8'];

export function t(text: Text3, lang: Lang): string {
  return text[lang] || text.en;
}
