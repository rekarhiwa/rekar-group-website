/** Soft ArtCraft-like lined atmosphere: concentric rings + blurred glows */
export function AtmosphereBg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Soft brand glows */}
      <div className="atmosphere-glow atmosphere-glow-a" />
      <div className="atmosphere-glow atmosphere-glow-b" />
      <div className="atmosphere-glow atmosphere-glow-c" />

      {/* Concentric dashed rings */}
      <div className="atmosphere-rings">
        <span className="atmosphere-ring atmosphere-ring-1" />
        <span className="atmosphere-ring atmosphere-ring-2" />
        <span className="atmosphere-ring atmosphere-ring-3" />
        <span className="atmosphere-ring atmosphere-ring-4" />
        <span className="atmosphere-ring atmosphere-ring-5" />
      </div>

      {/* Faint horizontal hairlines */}
      <div className="atmosphere-lines" />

      {/* Edge vignette so rings fade out */}
      <div className="atmosphere-vignette" />
    </div>
  );
}
