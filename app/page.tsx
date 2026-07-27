'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="py-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Loyalty program</p>
      <h1
        className="mt-3 max-w-lg font-[var(--font-display)] text-4xl font-semibold leading-tight sm:text-5xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Order. Earn. <span className="text-[var(--color-accent)]">Climb the board.</span>
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-text-muted)]">
        Every dish earns points. Points fill your wallet and your lifetime score — your rank
        only ever goes up.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/leaderboard"
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)]"
        >
          See the leaderboard
        </Link>
        {!loading && !user && (
          <Link
            href="/login"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:border-[var(--color-accent-muted)]"
          >
            Log in
          </Link>
        )}
        {!loading && user && (
          <Link
            href="/dashboard"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium hover:border-[var(--color-accent-muted)]"
          >
            Your dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
