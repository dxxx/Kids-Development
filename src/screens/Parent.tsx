import { useMemo, useRef, useState } from 'react';
import { LADDER } from '../core/ladder';
import { defaultProfile, minutesToday, parseProfile, type Profile } from '../core/store';
import { LANGS, type Lang, type TrackId } from '../core/types';
import { trackMax } from '../games';

const LANG_LABEL: Record<Lang, string> = { en: 'English', es: 'Español', ro: 'Română' };
const TRACKS: TrackId[] = ['number', 'logic', 'language'];

/** Second step of the adult gate: a sum a 5 year old is unlikely to type. */
function Gate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [a, b] = useMemo(() => [12 + Math.floor(Math.random() * 8), 6 + Math.floor(Math.random() * 7)], []);
  const [value, setValue] = useState('');
  return (
    <div className="screen parent gate">
      <h1>For grown-ups</h1>
      <p>
        What is {a} + {b}?
      </p>
      <input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
      <div className="row">
        <button className="btn" onClick={onCancel}>
          Back
        </button>
        <button className="btn btn-go" onClick={() => (Number(value) === a + b ? onPass() : setValue(''))}>
          Enter
        </button>
      </div>
    </div>
  );
}

export function Parent({ profile, update, onClose }: { profile: Profile; update: (fn: (p: Profile) => Profile) => Profile; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  if (!open) return <Gate onPass={() => setOpen(true)} onCancel={onClose} />;

  const s = profile.settings;
  const setSettings = (patch: Partial<Profile['settings']>) => update((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  const recent = profile.log.slice(-30).reverse();
  const week = Object.entries(profile.playtime)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 7);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `animal-rally-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const parsed = parseProfile(text);
    update(() => parsed);
  };

  return (
    <div className="screen parent">
      <div className="parent-head">
        <h1>Grown-ups corner</h1>
        <button className="btn btn-go" onClick={onClose}>
          Back to the game
        </button>
      </div>

      <section>
        <h2>Today</h2>
        <p>
          Played <b>{minutesToday(profile)}</b> of <b>{s.dailyLimitMinutes}</b> minutes. Trips finished: <b>{profile.progress.trips}</b>.
        </p>
        {week.length > 0 && (
          <table>
            <tbody>
              {week.map(([day, secs]) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{Math.round(secs / 60)} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Levels</h2>
        {TRACKS.map((tr) => {
          const st = profile.tracks[tr];
          const max = trackMax(tr);
          return (
            <div key={tr} className="track-row">
              <div>
                <b>{LADDER[tr].name}</b>: level {st.level} of {max}
                <div className="muted">{LADDER[tr].levels[st.level - 1]}</div>
              </div>
              <div className="row">
                <button className="btn btn-small" disabled={st.level <= 1} onClick={() => update((p) => ({ ...p, tracks: { ...p.tracks, [tr]: { ...st, level: st.level - 1, recent: [], justMoved: true } } }))}>
                  −
                </button>
                <button className="btn btn-small" disabled={st.level >= max} onClick={() => update((p) => ({ ...p, tracks: { ...p.tracks, [tr]: { ...st, level: st.level + 1, recent: [], justMoved: true } } }))}>
                  +
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <h2>Settings</h2>
        <label className="setting">
          Instruction language
          <select value={s.lang} onChange={(e) => setSettings({ lang: e.target.value as Lang })}>
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {LANG_LABEL[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="setting">
          Daily limit: {s.dailyLimitMinutes} minutes
          <input type="range" min={10} max={120} step={5} value={s.dailyLimitMinutes} onChange={(e) => setSettings({ dailyLimitMinutes: Number(e.target.value) })} />
        </label>
        <label className="check">
          <input type="checkbox" checked={s.voice} onChange={(e) => setSettings({ voice: e.target.checked })} /> Spoken instructions
        </label>
        <label className="check">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => setSettings({ reduceMotion: e.target.checked })} /> Calm mode (less animation)
        </label>
        <div className="setting">
          Skill mix (relative weights)
          {TRACKS.map((tr) => (
            <label key={tr} className="mix">
              {LADDER[tr].name}
              <input type="range" min={0} max={100} step={5} value={s.mix[tr]} onChange={(e) => setSettings({ mix: { ...s.mix, [tr]: Number(e.target.value) } })} />
              {s.mix[tr]}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>Recent rounds</h2>
        {recent.length === 0 ? (
          <p className="muted">Nothing played yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Game</th>
                <th>Level</th>
                <th>Form</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i}>
                  <td>{new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{r.game}</td>
                  <td>{r.level}</td>
                  <td>{r.mode}</td>
                  <td>
                    {r.outcome === 'clean' ? 'first try' : r.outcome === 'helped' ? `${r.misses + 1} tries` : 'left early'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Backup</h2>
        <div className="row">
          <button className="btn" onClick={exportJson}>
            Save progress to a file
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Load progress from a file
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
          <button
            className="btn btn-danger"
            onClick={() => {
              if (window.confirm('Reset all progress? This cannot be undone.')) update(() => defaultProfile());
            }}
          >
            Reset progress
          </button>
        </div>
      </section>
    </div>
  );
}
