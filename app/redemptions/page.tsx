'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { RedemptionRecord } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RedemptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redemptions, setRedemptions] = useState<RedemptionRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get<RedemptionRecord[]>('/redemptions/me')
      .then(setRedemptions)
      .catch(() => setError('Could not load your redemption history.'));
  }, [user]);

  if (loading || !user) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Redemption history
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Rewards you've redeemed with your wallet balance. Your loyalty points and rank were unaffected each time.
      </p>

      {error && <p className="mt-6 text-sm text-[var(--color-negative)]">{error}</p>}
      {!redemptions && !error && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>}

      {redemptions && redemptions.length === 0 && (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">
          No redemptions yet — check the rewards page to see what you can redeem.
        </p>
      )}

      {redemptions && redemptions.length > 0 && (
        <ul className="mt-6 flex flex-col gap-2">
          {redemptions.map((redemption) => (
            <li
              key={redemption.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div>
                <p className="text-sm font-medium">{redemption.reward.name}</p>
                <p className="text-xs text-[var(--color-text-faint)]">{formatDate(redemption.createdAt)}</p>
              </div>
              <span className="tabular-count text-sm font-semibold">-{redemption.pointsSpent}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}