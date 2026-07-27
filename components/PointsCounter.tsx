export function PointsCounter({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'accent';
}) {
  const color = tone === 'accent' ? 'var(--color-accent)' : 'var(--color-text)';

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-faint)]">{label}</p>
      <p
        className="tabular-count mt-2 text-4xl font-bold sm:text-5xl"
        style={{ color }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}
