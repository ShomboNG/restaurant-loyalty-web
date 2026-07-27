'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Reward } from '@/lib/types';

export default function RewardsPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Reward[]>('/redemptions/rewards')
      .then(setRewards)
      .catch(() => setError('Could not load rewards. Try again shortly.'));
  }, []);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Rewards
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Redeem in person at checkout — just ask a staff member and they'll apply it to your wallet.
      </p>

      {error && <p className="mt-6 text-sm text-[var(--color-negative)]">{error}</p>}
      {!rewards && !error && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>}

      {rewards && (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rewards.map((reward) => {
            const affordable = user ? user.walletBalance >= reward.costPoints : null;
            return (
              <li
                key={reward.id}
                className="flex items-start justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div>
                  <p className="font-medium">{reward.name}</p>
                  {reward.description && (
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{reward.description}</p>
                  )}
                  {affordable === true && (
                    <p className="mt-2 text-xs font-medium text-[var(--color-positive)]">You can redeem this now</p>
                  )}
                  {affordable === false && (
                    <p className="mt-2 text-xs text-[var(--color-text-faint)]">
                      Need {(reward.costPoints - (user?.walletBalance ?? 0)).toLocaleString()} more points
                    </p>
                  )}
                </div>
                <span className="tabular-count shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-sm font-semibold">
                  {reward.costPoints}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
