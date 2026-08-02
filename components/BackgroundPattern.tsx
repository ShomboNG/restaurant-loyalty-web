const CHILI_PATH =
  'M20 5 C14 5 8 10 8 18 C8 30 14 45 20 60 C26 45 32 30 32 18 C32 10 26 5 20 5 Z ' +
  'M20 5 C22 0 26 -3 30 -2 C27 2 24 4 20 5 Z';

const CHILIES = [
  { x: 15, y: 10, rotate: -20, scale: 1.1 },
  { x: 110, y: 25, rotate: 35, scale: 0.7 },
  { x: 55, y: 90, rotate: 110, scale: 0.9 },
  { x: 130, y: 110, rotate: -55, scale: 0.65 },
  { x: 80, y: 150, rotate: 15, scale: 0.55 },
  { x: 10, y: 130, rotate: 70, scale: 0.5 },
];

export function BackgroundPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ opacity: 0.4 }}
    >
      <defs>
        <pattern id="chili-pattern" width="170" height="170" patternUnits="userSpaceOnUse">
          <g fill="var(--color-pattern-accent, #d4151c)">
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