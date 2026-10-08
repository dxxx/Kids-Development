import { useState, type ReactNode } from 'react';

export interface Choice {
  id: string;
  label: ReactNode;
}

/**
 * Tap-to-choose grid used by several games.
 * Wrong picks fade out quietly (no buzzer, no red X).
 * misses >= 2: the right answer glows. misses >= 3: only two options remain.
 */
export function Choices({
  options,
  answerId,
  misses,
  onAttempt,
  big = false,
}: {
  options: Choice[];
  answerId: string;
  misses: number;
  onAttempt: (correct: boolean) => void;
  big?: boolean;
}) {
  const [tried, setTried] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  let visible = options;
  if (misses >= 3) {
    const keepWrong = options.find((o) => o.id !== answerId && !tried.includes(o.id));
    visible = options.filter((o) => o.id === answerId || o.id === keepWrong?.id);
  }

  return (
    <div className={`choices ${big ? 'choices-big' : ''}`}>
      {visible.map((o) => {
        const wrongTried = tried.includes(o.id);
        const glow = misses >= 2 && o.id === answerId;
        return (
          <button
            key={o.id}
            className={`choice ${wrongTried ? 'choice-faded' : ''} ${glow ? 'choice-glow' : ''} ${done && o.id === answerId ? 'choice-right' : ''}`}
            disabled={wrongTried || done}
            onClick={() => {
              const ok = o.id === answerId;
              if (ok) setDone(true);
              else setTried((t) => [...t, o.id]);
              onAttempt(ok);
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Fill a template like "Find {word}" with values. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
