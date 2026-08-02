'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import type { OrderRecord } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api
      .get<OrderRecord[]>('/orders/me')
      .then(setOrders)
      .catch(() => setError('Could not load your order history.'));
  }, [user]);

  if (loading || !user) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Order history
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">Every order that's earned you points, most recent first.</p>

      {error && <p className="mt-6 text-sm text-[var(--color-negative)]">{error}</p>}
      {!orders && !error && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>}

      {orders && orders.length === 0 && (
        <p className="mt-6 text-sm text-[var(--color-text-muted)]">
          No orders yet — your next visit will show up here.
        </p>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-faint)]">{formatDate(order.createdAt)}</span>
                <span className="tabular-count text-sm font-semibold text-[var(--color-accent)]">
                  +{order.totalPoints}
                </span>
              </div>

              <ul className="mt-3 flex flex-col gap-1">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span>
                      {item.quantity}× {item.menuItem.name}
                    </span>
                    <span className="tabular-count text-[var(--color-text-muted)]">+{item.pointsEarned}</span>
                  </li>
                ))}
              </ul>

              {order.note && (
                <p className="mt-2 text-xs text-[var(--color-text-faint)]">{order.note}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}