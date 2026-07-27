'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import type { MenuItem, OrderItemInput } from '@/lib/types';

interface LineItem extends OrderItemInput {
  menuItem: MenuItem;
}

export default function StaffOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  useEffect(() => {
    if (!loading && !isStaff) router.push('/login');
  }, [loading, isStaff, router]);

  useEffect(() => {
    if (!isStaff) return;
    api.get<MenuItem[]>('/menu-items').then(setMenuItems).catch(() => {});
  }, [isStaff]);

  const totalPoints = lineItems.reduce((sum, li) => sum + li.menuItem.pointsValue * li.quantity, 0);

  function addLineItem() {
    const menuItem = menuItems.find((m) => m.id === selectedItemId);
    if (!menuItem || quantity < 1) return;
    setLineItems((prev) => [...prev, { menuItemId: menuItem.id, quantity, menuItem }]);
    setSelectedItemId('');
    setQuantity(1);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitOrder() {
    setError(null);
    setSuccess(null);

    if (!customerEmail.trim()) {
      setError('Enter the customer\'s email.');
      return;
    }
    if (lineItems.length === 0) {
      setError('Add at least one item.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/orders', {
        userEmail: customerEmail.trim(),
        items: lineItems.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
        note: note.trim() || undefined,
      });
      setSuccess(`Order logged — ${totalPoints} points credited to ${customerEmail}.`);
      setLineItems([]);
      setCustomerEmail('');
      setNote('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log the order.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !isStaff) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Log an order
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Points are credited automatically based on each item's point value.
      </p>

      <label className="mt-6 flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Customer email</span>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="customer@example.com"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <span className="text-xs text-[var(--color-text-faint)]">
          New customer? This creates their account automatically.
        </span>
      </label>

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Add item</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="min-w-[200px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          >
            <option value="">Select a dish…</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (+{item.pointsValue})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <button
            type="button"
            onClick={addLineItem}
            disabled={!selectedItemId}
            className="rounded-[var(--radius-sm)] border border-[var(--color-accent-muted)] px-3 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-surface-raised)] disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      {lineItems.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {lineItems.map((li, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-2 text-sm"
            >
              <span>
                {li.quantity}× {li.menuItem.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="tabular-count text-[var(--color-accent)]">
                  +{li.menuItem.pointsValue * li.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => removeLineItem(i)}
                  className="text-[var(--color-text-faint)] hover:text-[var(--color-negative)]"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Note (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Table 4"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </label>

      <div className="mt-6 flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] px-4 py-3">
        <span className="text-sm text-[var(--color-text-muted)]">Total points to credit</span>
        <span className="tabular-count text-xl font-bold text-[var(--color-accent)]">{totalPoints}</span>
      </div>

      {error && <p className="mt-4 text-sm text-[var(--color-negative)]">{error}</p>}
      {success && <p className="mt-4 text-sm text-[var(--color-positive)]">{success}</p>}

      <button
        type="button"
        onClick={submitOrder}
        disabled={submitting}
        className="mt-4 w-full rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
      >
        {submitting ? 'Logging order…' : 'Log order & credit points'}
      </button>
    </div>
  );
}
