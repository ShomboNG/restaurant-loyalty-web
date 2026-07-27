'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { MenuItem } from '@/lib/types';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<MenuItem[]>('/menu-items')
      .then(setItems)
      .catch(() => setError('Could not load the menu. Try again shortly.'));
  }, []);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Menu
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Every dish earns you points toward your wallet and your rank.
      </p>

      {error && <p className="mt-6 text-sm text-[var(--color-negative)]">{error}</p>}
      {!items && !error && <p className="mt-6 text-sm text-[var(--color-text-muted)]">Loading…</p>}

      {items && (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.description}</p>
                )}
              </div>
              <span className="tabular-count shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-raised)] px-2.5 py-1 text-sm font-semibold text-[var(--color-accent)]">
                +{item.pointsValue}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
