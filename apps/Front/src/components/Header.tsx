 'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getCurrentUser } from '@/lib/auth';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/tickets', label: 'Chamados' },
  { href: '/tickets/new', label: 'Novo chamado' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);

  useEffect(() => setUser(getCurrentUser()), [pathname]);
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
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {user && <span className="hidden text-sm text-muted sm:inline">{user.name} · {user.role === 'ADMIN' ? 'Administrador' : user.role === 'AGENT' ? 'Suporte' : 'Cliente'}</span>}
          <button onClick={logout} className="text-sm font-medium text-muted hover:text-white">Sair</button>
        </nav>
      </div>
    </header>
  );
}
