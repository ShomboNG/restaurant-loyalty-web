'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { PointsCounter } from '@/components/PointsCounter';
import { RankBadge } from '@/components/RankBadge';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ rank: number }>(`/leaderboard/rank/${user.id}`)
      .then((r) => setRank(r.rank))
      .catch(() => setRank(null));
  }, [user]);

  if (loading || !user) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Hey{user.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {user.username ? `@${user.username}` : user.email}
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-muted)] hover:text-[var(--color-text)]"
        >
          Settings
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PointsCounter label="Wallet balance" value={user.walletBalance} />
        <PointsCounter label="Loyalty points" value={user.loyaltyPoints} tone="accent" />
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-faint)]">Your rank</p>
          <div className="mt-3 flex items-center gap-3">
            {rank !== null ? <RankBadge rank={rank} /> : <span className="text-sm text-[var(--color-text-muted)]">—</span>}
            <span className="text-sm text-[var(--color-text-muted)]">on the leaderboard</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/orders"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent-muted)]"
        >
          <p className="text-sm font-medium">Order history</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Every order that's earned you points</p>
        </Link>
        <Link
          href="/redemptions"
          className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent-muted)]"
        >
          <p className="text-sm font-medium">Redemption history</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">Rewards you've redeemed with your wallet</p>
        </Link>
      </div>

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
        Wallet balance is what you can redeem for rewards. Loyalty points are your lifetime
        score — they never go down, even after you redeem something, so your leaderboard
        rank is always safe.
      </div>
    </div>
  );
}