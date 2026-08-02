'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { UsernameEditor } from '@/components/UsernameEditor';

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await api.patch('/users/me', {
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>;
  }

  return (
    <div className="max-w-md">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Settings
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your profile.</p>

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Email</p>
        <p className="mt-1 text-sm">{user.email}</p>
        <p className="mt-1 text-xs text-[var(--color-text-faint)]">Can't be changed — this is how you log in.</p>
      </div>

      <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Username</p>
        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
          Shown on the public leaderboard instead of your name or email.
        </p>
        <div className="mt-2">
          <UsernameEditor user={user} />
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="mt-4 flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
          />
        </label>

        {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}
        {success && <p className="text-sm text-[var(--color-positive)]">Saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}