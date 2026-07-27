const TIER_COLOR: Record<number, string> = {
  1: 'var(--color-rank-gold)',
  2: 'var(--color-rank-silver)',
  3: 'var(--color-rank-bronze)',
};

export function RankBadge({ rank }: { rank: number }) {
  const color = TIER_COLOR[rank];

  if (!color) {
    return (
      <span className="tabular-count inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
        {rank}
      </span>
    );
  }

  return (
    <span
      className="tabular-count inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-sm font-bold"
      style={{
        color: 'var(--color-on-rank)',
        backgroundColor: color,
      }}
    >
      {rank}
    </span>
  );
}
