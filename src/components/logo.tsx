type Props = { className?: string };

/**
 * Marka isareti: pour-over hunisi (V60 silueti) + icine dusen damla.
 * Genel bir "kahve fincani" yerine demleme yontemini anlatiyor.
 * currentColor kullanir, 16px'e kadar okunur kalir.
 */
export function LogoMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Damla */}
      <path
        d="M12 2.2c1.55 1.95 2.35 3.2 2.35 4.15a2.35 2.35 0 0 1-4.7 0c0-.95.8-2.2 2.35-4.15Z"
        fill="currentColor"
      />
      {/* Huni govdesi */}
      <path
        d="M4.6 9.4h14.8l-6.2 10.1a2.4 2.4 0 0 1-2.4 0L4.6 9.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      {/* Ic kanallar (V60 ribs) */}
      <path d="M9.2 9.4l2 7.3M14.8 9.4l-2 7.3" stroke="currentColor" strokeWidth="1.1" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="size-6 text-primary" />
      <span className="font-display text-lg leading-none font-semibold tracking-tight">
        Brew<span className="text-primary">Log</span>
      </span>
    </span>
  );
}
