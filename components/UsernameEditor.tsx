'use client';

import { useState, useEffect, useRef } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { User } from '@/lib/types';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export function UsernameEditor({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const [editing, setEditing] = useState(!user.username);
  const [value, setValue] = useState(user.username ?? '');
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value === (user.username ?? '')) {
      setAvailability('idle');
      return;
    }
    if (!USERNAME_PATTERN.test(value)) {
      setAvailability(value.length > 0 ? 'invalid' : 'idle');
      return;
    }

    setAvailability('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await api.get<{ available: boolean }>(
          `/users/username-available?username=${encodeURIComponent(value)}`,
        );
        setAvailability(result.available ? 'available' : 'taken');
      } catch {
        setAvailability('idle');
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await api.patch('/users/me', { username: value });
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save username.');
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)]">
          @{user.username}
        </span>
        <button
          onClick={() => {
            setEditing(true);
            setValue(user.username ?? '');
          }}
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          Change
        </button>
      </div>
    );
  }

  const canSave = USERNAME_PATTERN.test(value) && (availability === 'available' || value === user.username);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-text-faint)]">@</span>
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="choose_a_username"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 py-1 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          onClick={save}
          disabled={!canSave || saving}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-[var(--color-on-accent)] disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {user.username && (
          <button
            onClick={() => {
              setEditing(false);
              setValue(user.username ?? '');
            }}
            className="text-xs text-[var(--color-text-muted)]"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="text-xs">
        {availability === 'checking' && <span className="text-[var(--color-text-faint)]">Checking…</span>}
        {availability === 'available' && <span className="text-[var(--color-positive)]">Available</span>}
        {availability === 'taken' && <span className="text-[var(--color-negative)]">Already taken</span>}
        {availability === 'invalid' && (
          <span className="text-[var(--color-negative)]">3-20 characters — letters, numbers, underscores only</span>
        )}
      </div>

      {error && <p className="text-xs text-[var(--color-negative)]">{error}</p>}
    </div>
  );
}