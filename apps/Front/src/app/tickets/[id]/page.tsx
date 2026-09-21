'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import type { Comment, Ticket, TicketStatus, User } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/Badges';
import { PageTitle, Button, Textarea, Select } from '@/components/UI';

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.getTicket(params.id), api.getUsers()])
      .then(([t, u]) => {
        setTicket(t);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('ticket:updated', (updated: Ticket) => {
      if (updated.id === params.id) {
        setTicket((prev) => (prev ? { ...prev, ...updated } : prev));
      }
    });

    socket.on('comment:added', ({ ticketId, comment: newComment }: { ticketId: string; comment: Comment }) => {
      if (ticketId === params.id) {
        setTicket((prev) =>
          prev
            ? { ...prev, comments: [...(prev.comments ?? []), newComment] }
            : prev,
        );
      }
    });

    return () => {
      socket.off('ticket:updated');
      socket.off('comment:added');
    };
  }, [params.id]);

  async function handleStatusChange(status: TicketStatus) {
    if (!ticket) return;
    setSaving(true);
    try {
      const updated = await api.updateTicket(ticket.id, { status });
      setTicket((prev) => (prev ? { ...prev, ...updated } : prev));
    } finally {
      setSaving(false);
    }
  }

  async function handleAssigneeChange(assigneeId: string) {
    if (!ticket) return;
    setSaving(true);
    try {
      const updated = await api.updateTicket(ticket.id, {
        assigneeId: assigneeId || null,
      });
      setTicket((prev) => (prev ? { ...prev, ...updated } : prev));
    } finally {
      setSaving(false);
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!ticket || !comment.trim()) return;

    setSaving(true);
    try {
      const newComment = await api.addComment(ticket.id, { content: comment });
      setTicket((prev) =>
        prev ? { ...prev, comments: [...(prev.comments ?? []), newComment] } : prev,
      );
      setComment('');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Carregando...</p>;
  if (!ticket) return <p className="text-red-400">Chamado não encontrado.</p>;

  const agents = users.filter((u) => u.role === 'AGENT' || u.role === 'ADMIN');
  const currentUser = getCurrentUser();
  const canManage = currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT';

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <PageTitle title={ticket.title} subtitle={`Aberto por ${ticket.creator.name}`} />

        <div className="rounded-xl border border-slate-800 bg-surface-light p-6">
          <h2 className="mb-3 font-semibold text-white">Descrição</h2>
          <p className="whitespace-pre-wrap text-slate-300">{ticket.description}</p>
        </div>

        <section>
          <h2 className="mb-4 font-semibold text-white">
            Comentários ({ticket.comments?.length ?? 0})
          </h2>

          <div className="mb-4 space-y-4">
            {(ticket.comments ?? []).map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-800 bg-surface p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span className="font-medium text-slate-300">{c.author.name}</span>
                  <span>{new Date(c.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-slate-300">{c.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="space-y-3">
            <Textarea
              label="Adicionar comentário"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva uma atualização..."
            />
            <p className="text-sm text-muted">Comentando como <span className="text-slate-200">{currentUser?.name}</span></p>
            <Button type="submit" disabled={saving || !comment.trim()}>
              Enviar comentário
            </Button>
          </form>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-surface-light p-5">
          <h3 className="mb-4 font-semibold text-white">Detalhes</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Status</dt>
              <dd><StatusBadge status={ticket.status} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Prioridade</dt>
              <dd><PriorityBadge priority={ticket.priority} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Criado em</dt>
              <dd className="text-white">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</dd>
            </div>
          </dl>
        </div>

        {canManage && <div className="rounded-xl border border-slate-800 bg-surface-light p-5 space-y-4">
          <Select
            label="Alterar status"
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
            disabled={saving}
          >
            <option value="OPEN">Aberto</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="RESOLVED">Resolvido</option>
            <option value="CLOSED">Fechado</option>
          </Select>

          <Select
            label="Responsável"
            value={ticket.assignee?.id ?? ''}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            disabled={saving}
          >
            <option value="">Sem responsável</option>
            {agents.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>}
      </aside>
    </div>
  );
}
