import { photo } from '../core/photos';

/** A real photo when one has been downloaded, otherwise the emoji placeholder. */
export function Pic({ id, emoji, className = '', alt = '' }: { id: string; emoji: string; className?: string; alt?: string }) {
  const src = photo(id);
  return src ? (
    <img className={`pic ${className}`} src={src} alt={alt} draggable={false} loading="lazy" />
  ) : (
    <span className={`pic pic-emoji ${className}`} aria-label={alt}>
      {emoji}
    </span>
  );
}
