'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { LeaderboardEntry } from '@/lib/types';
import { RankBadge } from '@/components/RankBadge';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<LeaderboardEntry[]>('/leaderboard?limit=20')
      .then(setEntries)
      .catch(() => setError('Could not load the leaderboard. Try again shortly.'));
  }, []);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Leaderboard
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Ranked by lifetime loyalty points. Redeeming rewards never costs you your rank.
      </p>

      {error && <p className="mt-6 text-sm text-[var(--color-negative)]">{error}</p>}

      {!entries && !error && (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>
      )}

      {entries && entries.length === 0 && (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">
          No one's on the board yet. Log an order to be the first.
        </p>
      )}

      {entries && entries.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <RankBadge rank={entry.rank} />
                <span className="text-sm font-medium">
                  {entry.username ? `@${entry.username}` : entry.name ?? entry.email}
                </span>
              </div>
              <span className="tabular-count text-lg font-semibold text-[var(--color-accent)]">
                {entry.loyaltyPoints.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
