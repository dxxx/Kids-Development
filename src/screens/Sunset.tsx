import { t, UI } from '../core/i18n';
import type { Profile } from '../core/store';
import { HoldButton } from './HoldButton';

export function Sunset({ profile, onParent }: { profile: Profile; onParent: () => void }) {
  const lang = profile.settings.lang;
  return (
    <div className="screen sunset">
      <div className="sunset-sky">🌅</div>
      <div className="sunset-car" style={{ color: profile.progress.carColour }}>
        🚙💤
      </div>
      <p className="sunset-text">{t(UI.parked, lang)}</p>
      <HoldButton className="btn-parent" seconds={3} onDone={onParent}>
        🔒 {t(UI.parent, lang)}
      </HoldButton>
    </div>
  );
}
