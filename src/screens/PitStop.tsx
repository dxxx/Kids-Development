import { useEffect } from 'react';
import { CAR_COLOURS, CREW, STOPS, t, UI } from '../core/i18n';
import type { Profile } from '../core/store';
import { speak } from '../core/voice';

/** One minute of free play between trips: no learning goal, just a reward and a reset. */
export function PitStop({ profile, update, onDone }: { profile: Profile; update: (fn: (p: Profile) => Profile) => Profile; onDone: () => void }) {
  const lang = profile.settings.lang;
  const stop = STOPS[profile.progress.stop % STOPS.length];
  const newest = CREW[profile.progress.crew - 1];

  useEffect(() => {
    speak(`${t(UI.arrived, lang)} ${t(stop.name, lang)}! ${t(UI.newFriend, lang)}`, lang); // once on arrival
  }, []);

  return (
    <div className="screen pit">
      <h1>
        {stop.emoji} {t(UI.arrived, lang)} {t(stop.name, lang)}!
      </h1>
      <div className="new-friend">
        <span className="new-friend-emoji">{newest}</span>
        <span>{t(UI.newFriend, lang)}</span>
      </div>

      <h2>{t(UI.pickColour, lang)}</h2>
      <div className="colours">
        {CAR_COLOURS.map((c) => (
          <button
            key={c}
            className={`colour ${profile.progress.carColour === c ? 'colour-on' : ''}`}
            style={{ background: c }}
            onClick={() => update((p) => ({ ...p, progress: { ...p.progress, carColour: c } }))}
            aria-label={`colour ${c}`}
          >
            🚙
          </button>
        ))}
      </div>

      <button className="btn btn-go btn-wide" onClick={onDone}>
        {t(UI.drive, lang)} ➜
      </button>
    </div>
  );
}
