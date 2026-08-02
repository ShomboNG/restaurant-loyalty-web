'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from './ThemeToggle';

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm transition-colors ${
        active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
      }`}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  function closeMenu() {
    setMenuOpen(false);
  }

  const links = (
    <>
      <NavLink href="/leaderboard" onClick={closeMenu}>
        Leaderboard
      </NavLink>
      <NavLink href="/menu" onClick={closeMenu}>
        Menu
      </NavLink>
      <NavLink href="/rewards" onClick={closeMenu}>
        Rewards
      </NavLink>
      {isStaff && (
        <>
          <NavLink href="/staff/orders" onClick={closeMenu}>
            Log order
          </NavLink>
          <NavLink href="/staff/redeem" onClick={closeMenu}>
            Redeem
          </NavLink>
          <NavLink href="/staff/menu-items" onClick={closeMenu}>
            Manage menu
          </NavLink>
          <NavLink href="/staff/rewards" onClick={closeMenu}>
            Manage rewards
          </NavLink>
        </>
      )}
      {!loading && user && (
    <>
      <NavLink href="/dashboard" onClick={closeMenu}>
        Dashboard
      </NavLink>
      <NavLink href="/orders" onClick={closeMenu}>
          My orders
      </NavLink>
      <NavLink href="/redemptions" onClick={closeMenu}>
          My redemptions
      </NavLink>        <NavLink href="/settings" onClick={closeMenu}>
          Settings
      </NavLink>
      </>
    )}
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shombo<span className="text-[var(--color-accent)]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">{links}</nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!loading &&
            (user ? (
              <button
                onClick={logout}
                className="hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-muted)] hover:text-[var(--color-text)] sm:block"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-on-accent)] transition-colors hover:bg-[var(--color-accent-strong)] sm:block"
              >
                Log in
              </Link>
            ))}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text)] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">{links}</nav>
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            {!loading &&
              (user ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-sm text-[var(--color-text-muted)]"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="inline-block rounded-[var(--radius-sm)] bg-[var(--color-accent)] px-4 py-1.5 text-sm font-medium text-[var(--color-on-accent)]"
                >
                  Log in
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}