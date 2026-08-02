// A single stylized chili silhouette (body + curled stem), reused at
// varied position/rotation/scale to build an organic scattered pattern —
// mirrors the scattered-chili motif from the brand guidelines.
const CHILI_PATH =
  'M20 5 C14 5 8 10 8 18 C8 30 14 45 20 60 C26 45 32 30 32 18 C32 10 26 5 20 5 Z ' +
  'M20 5 C22 0 26 -3 30 -2 C27 2 24 4 20 5 Z';

const CHILIES = [
  { x: 15, y: 10, rotate: -20, scale: 0.9 },
  { x: 140, y: 30, rotate: 35, scale: 0.55 },
  { x: 70, y: 120, rotate: 110, scale: 0.75 },
  { x: 170, y: 150, rotate: -55, scale: 0.5 },
  { x: 100, y: 190, rotate: 15, scale: 0.4 },
];

export function BackgroundPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ opacity: 0.07 }}
    >
      <defs>
        <pattern id="chili-pattern" width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="var(--color-pattern-accent)">
            {CHILIES.map((c, i) => (
              <path
                key={i}
                d={CHILI_PATH}
                transform={`translate(${c.x} ${c.y}) rotate(${c.rotate}) scale(${c.scale})`}
              />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#chili-pattern)" />
    </svg>
  );
}