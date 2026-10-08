import type { Text3 } from '../../core/types';

export interface Word {
  emoji: string;
  text: Text3;
}

/** Animals, vehicles and everyday things in English, Spanish and Romanian. */
export const WORDS: Word[] = [
  { emoji: '🐶', text: { en: 'dog', es: 'perro', ro: 'câine' } },
  { emoji: '🐱', text: { en: 'cat', es: 'gato', ro: 'pisică' } },
  { emoji: '🦁', text: { en: 'lion', es: 'león', ro: 'leu' } },
  { emoji: '🦓', text: { en: 'zebra', es: 'cebra', ro: 'zebră' } },
  { emoji: '🦛', text: { en: 'hippo', es: 'hipopótamo', ro: 'hipopotam' } },
  { emoji: '🐒', text: { en: 'monkey', es: 'mono', ro: 'maimuță' } },
  { emoji: '🦜', text: { en: 'parrot', es: 'loro', ro: 'papagal' } },
  { emoji: '🐘', text: { en: 'elephant', es: 'elefante', ro: 'elefant' } },
  { emoji: '🦒', text: { en: 'giraffe', es: 'jirafa', ro: 'girafă' } },
  { emoji: '🐦', text: { en: 'bird', es: 'pájaro', ro: 'pasăre' } },
  { emoji: '🐟', text: { en: 'fish', es: 'pez', ro: 'pește' } },
  { emoji: '🐴', text: { en: 'horse', es: 'caballo', ro: 'cal' } },
  { emoji: '🐮', text: { en: 'cow', es: 'vaca', ro: 'vacă' } },
  { emoji: '🐷', text: { en: 'pig', es: 'cerdo', ro: 'porc' } },
  { emoji: '🦆', text: { en: 'duck', es: 'pato', ro: 'rață' } },
  { emoji: '🐸', text: { en: 'frog', es: 'rana', ro: 'broască' } },
  { emoji: '🚗', text: { en: 'car', es: 'coche', ro: 'mașină' } },
  { emoji: '🚌', text: { en: 'bus', es: 'autobús', ro: 'autobuz' } },
  { emoji: '🚆', text: { en: 'train', es: 'tren', ro: 'tren' } },
  { emoji: '✈️', text: { en: 'plane', es: 'avión', ro: 'avion' } },
  { emoji: '⛵', text: { en: 'boat', es: 'barco', ro: 'barcă' } },
  { emoji: '🚲', text: { en: 'bike', es: 'bicicleta', ro: 'bicicletă' } },
  { emoji: '🚚', text: { en: 'truck', es: 'camión', ro: 'camion' } },
  { emoji: '🍎', text: { en: 'apple', es: 'manzana', ro: 'măr' } },
  { emoji: '🍌', text: { en: 'banana', es: 'plátano', ro: 'banană' } },
  { emoji: '☀️', text: { en: 'sun', es: 'sol', ro: 'soare' } },
  { emoji: '🌙', text: { en: 'moon', es: 'luna', ro: 'lună' } },
  { emoji: '🌳', text: { en: 'tree', es: 'árbol', ro: 'copac' } },
  { emoji: '🏠', text: { en: 'house', es: 'casa', ro: 'casă' } },
  { emoji: '💧', text: { en: 'water', es: 'agua', ro: 'apă' } },
];

export const LANG_NAMES: Record<'en' | 'es' | 'ro', Text3> = {
  en: { en: 'English', es: 'inglés', ro: 'engleză' },
  es: { en: 'Spanish', es: 'español', ro: 'spaniolă' },
  ro: { en: 'Romanian', es: 'rumano', ro: 'română' },
};
