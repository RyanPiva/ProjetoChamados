 'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getCurrentUser } from '@/lib/auth';

const defaultLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/tickets', label: 'Chamados' },
  { href: '/tickets/new', label: 'Novo chamado' },
];

const customerLinks = [
  { href: '/tickets/new', label: 'Novo chamado', tone: 'green' },
  { href: '/tickets', label: 'Meus chamados', tone: 'white' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);

  useEffect(() => setUser(getCurrentUser()), [pathname]);
  const links = user?.role === 'USER' ? customerLinks : defaultLinks;

  if (pathname === '/login') return null;

  function logout() {
    clearSession();
    router.replace('/login');
  }

  return (
    <header className="border-b border-slate-800 bg-surface-light/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          Chamados<span className="text-brand-500">.</span>
        </Link>
        <nav className="flex items-center gap-3">
          {links.map((link) => {
            const isCustomerLink = link.href === '/tickets/new' || link.href === '/tickets';
            const toneClass =
              link.href === '/tickets/new'
                ? 'border border-emerald-500 bg-emerald-600/15 text-emerald-200 hover:bg-emerald-600/25'
                : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100';

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isCustomerLink
                    ? `rounded-full px-3 py-1.5 text-sm font-medium transition ${toneClass}`
                    : 'text-sm font-medium text-muted transition hover:text-white'
                }
              >
                {link.label}
              </Link>
            );
          })}
          {user && <span className="hidden text-sm text-muted sm:inline">{user.name} · {user.role === 'ADMIN' ? 'Administrador' : user.role === 'AGENT' ? 'Suporte' : 'Cliente'}</span>}
          <button onClick={logout} className="text-sm font-medium text-muted hover:text-white">Sair</button>
        </nav>
      </div>
    </header>
  );
}
