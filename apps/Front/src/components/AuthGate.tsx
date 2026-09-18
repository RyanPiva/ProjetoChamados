'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === '/login');

  useEffect(() => {
    if (pathname === '/login') {
      setReady(true);
      return;
    }
    if (!getToken()) router.replace('/login');
    else setReady(true);
  }, [pathname, router]);

  return ready ? children : <p className="p-8 text-muted">Verificando acesso...</p>;
}