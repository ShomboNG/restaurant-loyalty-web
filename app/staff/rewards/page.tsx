'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import type { Reward } from '@/lib/types';

export default function StaffRewardsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [costPoints, setCostPoints] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isStaff) router.push('/login');
  }, [loading, isStaff, router]);

  function loadRewards() {
    api.get<Reward[]>('/redemptions/rewards?includeInactive=true').then(setRewards).catch(() => {});
  }

  useEffect(() => {
    if (isStaff) loadRewards();
  }, [isStaff]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/redemptions/rewards', {
        name: name.trim(),
        description: description.trim() || undefined,
        costPoints,
      });
      setName('');
      setDescription('');
      setCostPoints(50);
      loadRewards();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create this reward.');
    } finally {
      setSubmitting(false);
    }
  }

  async function updateCost(reward: Reward, newValue: number) {
    try {
      await api.patch(`/redemptions/rewards/${reward.id}`, { costPoints: newValue });
      loadRewards();
    } catch {
      setError('Could not update the cost.');
    }
  }

  async function toggleActive(reward: Reward) {
    try {
      await api.patch(`/redemptions/rewards/${reward.id}`, { active: !reward.active });
      loadRewards();
    } catch {
      setError('Could not update this reward.');
    }
  }

  if (loading || !isStaff) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Manage rewards
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Set what customers can redeem with their wallet balance.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Free drink"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex w-28 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Cost (pts)</span>
          <input
            type="number"
            min={1}
            required
            value={costPoints}
            onChange={(e) => setCostPoints(Number(e.target.value))}
            className="tabular-count rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
        >
          Add reward
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-[var(--color-negative)]">{error}</p>}

      <ul className="mt-6 flex flex-col gap-2">
        {rewards.map((reward) => (
          <li
            key={reward.id}
            className={`flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2.5 ${
              !reward.active ? 'opacity-50' : ''
            }`}
          >
            <div>
              <p className="text-sm font-medium">{reward.name}</p>
              {reward.description && (
                <p className="text-xs text-[var(--color-text-muted)]">{reward.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                defaultValue={reward.costPoints}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  if (val !== reward.costPoints) updateCost(reward, val);
                }}
                className="tabular-count w-20 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={() => toggleActive(reward)}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {reward.active ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </li>
        ))}
        {rewards.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">No rewards yet — add one above.</p>
        )}
      </ul>
    </div>
  );
}