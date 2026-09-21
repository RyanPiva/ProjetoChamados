'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { TicketPriority } from '@/types';
import { PageTitle, Button, Input, Textarea, Select } from '@/components/UI';

export default function NewTicketPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);

    try {
      const ticket = await api.createTicket({
        title: form.get('title') as string,
        description: form.get('description') as string,
        priority: form.get('priority') as TicketPriority,
      });
      router.push(`/tickets/${ticket.id}`);
    } catch {
      setError('Não foi possível criar o chamado. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Novo chamado" subtitle="Abra um ticket para a equipe de suporte" />

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-800 bg-surface-light p-6">
        <Input name="title" label="Título" required placeholder="Ex: Impressora não funciona" />

        <Textarea
          name="description"
          label="Descrição"
          required
          minLength={10}
          placeholder="Descreva o problema com detalhes..."
        />

        <div className="grid gap-5 sm:grid-cols-1">
          <Select name="priority" label="Setor" defaultValue="LOW">
            <option value="LOW">Administrativo</option>
            <option value="MEDIUM">Financeiro</option>
            <option value="HIGH">RH</option>
            <option value="URGENT">Operações</option>
          </Select>
        </div>

        <p className="text-sm text-muted">Solicitante: <span className="text-slate-200">{user?.name}</span></p>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar chamado'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
