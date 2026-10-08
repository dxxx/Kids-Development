import { useCallback, useEffect, useRef, useState } from 'react';
import { CREW } from './core/i18n';
import { isOverLimit, loadProfile, saveProfile, today, type Profile } from './core/store';
import { setVoiceEnabled, stopSpeaking } from './core/voice';
import { Home } from './screens/Home';
import { Parent } from './screens/Parent';
import { PitStop } from './screens/PitStop';
import { Sunset } from './screens/Sunset';
import { Trip } from './screens/Trip';

type Screen = 'home' | 'trip' | 'pit' | 'sunset' | 'parent';
const TICK_SECONDS = 10;

export function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const ref = useRef(profile);
  const [screen, setScreen] = useState<Screen>(() => (isOverLimit(ref.current) ? 'sunset' : 'home'));
  const [tripId, setTripId] = useState(0);

  /** Synchronous update: returns the new profile and saves it. */
  const update = useCallback((fn: (p: Profile) => Profile): Profile => {
    const next = fn(ref.current);
    ref.current = next;
    setProfile(next);
    saveProfile(next);
    return next;
  }, []);

  useEffect(() => setVoiceEnabled(profile.settings.voice), [profile.settings.voice]);
  useEffect(() => {
    document.documentElement.classList.toggle('calm', profile.settings.reduceMotion);
  }, [profile.settings.reduceMotion]);

  // Count play time only while a trip or pit stop is on screen and the tab is visible.
  useEffect(() => {
    if (screen !== 'trip' && screen !== 'pit') return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      update((p) => {
        const d = today();
        return { ...p, playtime: { ...p.playtime, [d]: (p.playtime[d] ?? 0) + TICK_SECONDS } };
      });
    }, TICK_SECONDS * 1000);
    return () => window.clearInterval(id);
  }, [screen, update]);

  const go = (s: Screen) => {
    stopSpeaking();
    setScreen(s);
  };

  const startTrip = () => {
    if (isOverLimit(ref.current)) return go('sunset');
    setTripId((n) => n + 1);
    go('trip');
  };

  const finishTrip = (lastGameId: string) => {
    update((p) => ({
      ...p,
      progress: {
        ...p.progress,
        trips: p.progress.trips + 1,
        stop: p.progress.stop + 1,
        crew: Math.min(CREW.length, p.progress.crew + 1),
        lastGameId,
      },
    }));
    go('pit');
  };

  switch (screen) {
    case 'trip':
      return <Trip key={tripId} profile={profile} update={update} onFinished={finishTrip} />;
    case 'pit':
      return <PitStop profile={profile} update={update} onDone={() => go(isOverLimit(ref.current) ? 'sunset' : 'home')} />;
    case 'sunset':
      return <Sunset profile={profile} onParent={() => go('parent')} />;
    case 'parent':
      return <Parent profile={profile} update={update} onClose={() => go(isOverLimit(ref.current) ? 'sunset' : 'home')} />;
    default:
      return <Home profile={profile} onGo={startTrip} onParent={() => go('parent')} />;
  }
}
