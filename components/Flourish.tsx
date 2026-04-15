interface FlourishProps {
  className?: string;
}

/**
 * A subtle ornamental divider. A central six-pointed diamond flanked by
 * thin tapering lines — evokes Jewish manuscript ornament without being
 * on-the-nose. Used between sections and as a visual breath.
 */
export default function Flourish({ className }: FlourishProps) {
  return (
    <div
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        width="120"
        height="16"
        viewBox="0 0 120 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-accent/60"
      >
        <line x1="0" y1="8" x2="46" y2="8" stroke="currentColor" strokeWidth="0.75" />
        <path
          d="M60 2 L66 8 L60 14 L54 8 Z"
          stroke="currentColor"
          strokeWidth="0.75"
          fill="none"
        />
        <circle cx="60" cy="8" r="1" fill="currentColor" />
        <line x1="74" y1="8" x2="120" y2="8" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    </div>
  );
}
