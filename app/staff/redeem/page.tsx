'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import type { Reward, User } from '@/lib/types';

export default function StaffRedeemPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!loading && !isStaff) router.push('/login');
  }, [loading, isStaff, router]);

  useEffect(() => {
    if (!isStaff) return;
    api.get<Reward[]>('/redemptions/rewards').then(setRewards).catch(() => {});
  }, [isStaff]);

  async function search() {
    if (!searchQuery.trim()) return;
    try {
      const found = await api.get<User[]>(`/users/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setResults(found);
    } catch {
      setResults([]);
    }
  }

  async function redeem(reward: Reward) {
    if (!selectedCustomer) return;
    setError(null);
    setSuccess(null);
    setRedeeming(true);
    try {
      await api.post('/redemptions', { userId: selectedCustomer.id, rewardId: reward.id });
      setSuccess(`Redeemed "${reward.name}" for ${selectedCustomer.email}.`);
      setSelectedCustomer({ ...selectedCustomer, walletBalance: selectedCustomer.walletBalance - reward.costPoints });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not redeem this reward.');
    } finally {
      setRedeeming(false);
    }
  }

  if (loading || !isStaff) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Redeem a reward
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Only wallet balance is spent — loyalty points and rank are unaffected.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search customer by email or name"
          className="flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          onClick={search}
          className="rounded-[var(--radius-sm)] border border-[var(--color-accent-muted)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-surface-raised)]"
        >
          Search
        </button>
      </div>

      {results.length > 0 && !selectedCustomer && (
        <ul className="mt-3 flex flex-col gap-2">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => setSelectedCustomer(r)}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-left text-sm hover:border-[var(--color-accent-muted)]"
              >
                {r.name ?? r.email} <span className="text-[var(--color-text-faint)]">— {r.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCustomer && (
        <div className="mt-6">
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div>
              <p className="font-medium">{selectedCustomer.name ?? selectedCustomer.email}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{selectedCustomer.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Wallet</p>
              <p className="tabular-count text-xl font-bold">{selectedCustomer.walletBalance}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCustomer(null)}
            className="mt-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            Choose a different customer
          </button>

          <p className="mt-6 text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Rewards</p>
          <ul className="mt-3 flex flex-col gap-2">
            {rewards.map((reward) => {
              const affordable = selectedCustomer.walletBalance >= reward.costPoints;
              return (
                <li
                  key={reward.id}
                  className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{reward.name}</p>
                    <p className="tabular-count text-xs text-[var(--color-text-muted)]">{reward.costPoints} pts</p>
                  </div>
                  <button
                    onClick={() => redeem(reward)}
                    disabled={!affordable || redeeming}
                    className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-40"
                  >
                    Redeem
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-[var(--color-negative)]">{error}</p>}
      {success && <p className="mt-4 text-sm text-[var(--color-positive)]">{success}</p>}
    </div>
  );
}
