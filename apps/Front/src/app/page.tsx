 'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Ticket, TicketStats } from '@/types';
import { StatCard, PageTitle, Button } from '@/components/UI';
import { TicketCard } from '@/components/TicketCard';

export default function DashboardPage() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    Promise.all([api.getStats(), api.getTickets()]).then(([nextStats, nextTickets]) => {
      setStats(nextStats);
      setTickets(nextTickets);
    });
  }, []);
  if (!stats) return <p className="text-muted">Carregando...</p>;

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Visão geral dos chamados da empresa"
        action={
          <Link href="/tickets/new">
            <Button>Novo chamado</Button>
          </Link>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Abertos" value={stats.open} accent="text-blue-400" />
        <StatCard label="Em andamento" value={stats.inProgress} accent="text-amber-400" />
        <StatCard label="Resolvidos" value={stats.resolved} accent="text-emerald-400" />
        <StatCard label="Fechados" value={stats.closed} accent="text-slate-400" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Chamados recentes</h2>
          <Link href="/tickets" className="text-sm text-brand-500 hover:text-brand-600">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4">
          {tickets.length === 0 ? (
            <p className="text-muted">Nenhum chamado registrado ainda.</p>
          ) : (
            tickets.slice(0, 5).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      </section>
    </div>
  );
}
