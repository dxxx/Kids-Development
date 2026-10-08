import { CREW, STOPS, t, UI } from '../core/i18n';
import type { Profile } from '../core/store';
import { HoldButton } from './HoldButton';

export function Home({ profile, onGo, onParent }: { profile: Profile; onGo: () => void; onParent: () => void }) {
  const lang = profile.settings.lang;
  const stop = profile.progress.stop % STOPS.length;
  return (
    <div className="screen home">
      <div className="topbar">
        <span />
        <HoldButton className="btn-parent" seconds={3} onDone={onParent}>
          🔒 {t(UI.parent, lang)}
        </HoldButton>
      </div>

      <div className="map">
        {STOPS.map((s, i) => (
          <div key={i} className={`stop ${i === stop ? 'stop-here' : ''} ${i < stop ? 'stop-done' : ''}`}>
            <span className="stop-emoji">{s.emoji}</span>
            {i === stop && (
              <span className="stop-car" style={{ color: profile.progress.carColour }}>
                🚙
              </span>
            )}
          </div>
        ))}
      </div>

      <button className="go-car" onClick={onGo} style={{ background: profile.progress.carColour }}>
        <span className="go-emoji">🚙</span>
        <span>{t(UI.go, lang)}</span>
      </button>

      <div className="crew">
        <span className="crew-label">{t(UI.garage, lang)}</span>
        {CREW.slice(0, profile.progress.crew).map((c, i) => (
          <span key={i} className="crew-member">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
