'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import type { MenuItem } from '@/lib/types';

export default function StaffMenuItemsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pointsValue, setPointsValue] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isStaff) router.push('/login');
  }, [loading, isStaff, router]);

  function loadItems() {
    api.get<MenuItem[]>('/menu-items?includeInactive=true').then(setItems).catch(() => {});
  }

  useEffect(() => {
    if (isStaff) loadItems();
  }, [isStaff]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/menu-items', {
        name: name.trim(),
        description: description.trim() || undefined,
        pointsValue,
      });
      setName('');
      setDescription('');
      setPointsValue(10);
      loadItems();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create this item.');
    } finally {
      setSubmitting(false);
    }
  }

  async function updatePoints(item: MenuItem, newValue: number) {
    try {
      await api.patch(`/menu-items/${item.id}`, { pointsValue: newValue });
      loadItems();
    } catch {
      setError('Could not update points value.');
    }
  }

  async function toggleActive(item: MenuItem) {
    try {
      if (item.active) {
        await api.delete(`/menu-items/${item.id}`);
      } else {
        await api.patch(`/menu-items/${item.id}`, { active: true });
      }
      loadItems();
    } catch {
      setError('Could not update this item.');
    }
  }

  if (loading || !isStaff) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Manage menu
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Set how many points each dish earns.
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex flex-wrap items-end gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex min-w-[160px] flex-1 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <label className="flex w-28 flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Points</span>
          <input
            type="number"
            min={0}
            required
            value={pointsValue}
            onChange={(e) => setPointsValue(Number(e.target.value))}
            className="tabular-count rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
        >
          Add item
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-[var(--color-negative)]">{error}</p>}

      <ul className="mt-6 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2.5 ${
              !item.active ? 'opacity-50' : ''
            }`}
          >
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              {item.description && (
                <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                defaultValue={item.pointsValue}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  if (val !== item.pointsValue) updatePoints(item, val);
                }}
                className="tabular-count w-20 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={() => toggleActive(item)}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {item.active ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
