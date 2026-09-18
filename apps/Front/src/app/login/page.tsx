'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { Button, Input } from '@/components/UI';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const session = await api.login(form.get('email') as string, form.get('password') as string);
      saveSession(session.accessToken, session.user);
      router.replace('/');
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border border-slate-800 bg-surface-light p-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500">Chamados</p>
      <h1 className="text-3xl font-bold text-white">Entrar</h1>
      <p className="mt-2 text-muted">Acesse o painel de suporte da sua empresa.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input name="email" label="E-mail" type="email" required autoComplete="email" />
        <Input name="password" label="Senha" type="password" required autoComplete="current-password" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className="mt-6 text-xs text-muted">Contas de demonstração usam a senha 123456.</p>
    </div>
  );
}