import type { Lang } from './types';

/**
 * Spoken instructions via the browser's speech engine. Free and offline on most tablets.
 * British English is preferred for English, matching the curriculum.
 * Swap this module for pre-recorded audio later without touching the games.
 */
const LOCALES: Record<Lang, string[]> = {
  en: ['en-GB', 'en-US', 'en'],
  es: ['es-ES', 'es-MX', 'es'],
  ro: ['ro-RO', 'ro'],
};

let enabled = true;

export function setVoiceEnabled(on: boolean) {
  enabled = on;
  if (!on) stopSpeaking();
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  for (const loc of LOCALES[lang]) {
    const v = voices.find((x) => x.lang.toLowerCase().startsWith(loc.toLowerCase()));
    if (v) return v;
  }
  return undefined;
}

export function speak(text: string, lang: Lang) {
  if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(lang);
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? LOCALES[lang][0];
  u.rate = 0.9;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
