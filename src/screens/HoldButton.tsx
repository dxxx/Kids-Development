import { useRef, useState, type ReactNode } from 'react';

/** A button that only fires after being held, so small hands do not open grown-up screens by accident. */
export function HoldButton({ seconds, onDone, children, className = '' }: { seconds: number; onDone: () => void; children: ReactNode; className?: string }) {
  const timer = useRef<number | null>(null);
  const [holding, setHolding] = useState(false);

  const start = () => {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      onDone();
    }, seconds * 1000);
  };
  const stop = () => {
    setHolding(false);
    if (timer.current) window.clearTimeout(timer.current);
  };

  return (
    <button
      className={`btn hold ${holding ? 'hold-active' : ''} ${className}`}
      style={{ ['--hold' as string]: `${seconds}s` }}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}
