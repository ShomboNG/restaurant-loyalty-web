'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { requestOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await requestOtp(email);
      setStep('code');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyOtp(email, code);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid code. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="font-[var(--font-display)] text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        {step === 'email' ? 'Log in' : 'Enter your code'}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        {step === 'email'
          ? "We'll send a one-time code to your email — no password needed."
          : `We sent a 6-digit code to ${email}.`}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleRequestOtp} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">Email</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
            />
          </label>

          {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.1em] text-[var(--color-text-faint)]">6-digit code</span>
            <input
              type="text"
              inputMode="numeric"
              required
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="tabular-count rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-lg tracking-[0.3em] outline-none focus:border-[var(--color-accent)]"
            />
          </label>

          {error && <p className="text-sm text-[var(--color-negative)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting || code.length !== 6}
            className="mt-2 rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] disabled:opacity-50"
          >
            {submitting ? 'Verifying…' : 'Verify & log in'}
          </button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
