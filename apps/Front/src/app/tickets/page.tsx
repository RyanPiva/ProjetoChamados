'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import type { Ticket, TicketStatus } from '@/types';
import { TicketCard } from '@/components/TicketCard';
import { PageTitle, Button } from '@/components/UI';

const filters: { label: string; value?: TicketStatus }[] = [
  { label: 'Todos' },
  { label: 'Abertos', value: 'OPEN' },
  { label: 'Em andamento', value: 'IN_PROGRESS' },
  { label: 'Resolvidos', value: 'RESOLVED' },
  { label: 'Fechados', value: 'CLOSED' },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTickets(filter).then(setTickets).finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('ticket:created', (ticket: Ticket) => {
      setTickets((prev) => [ticket, ...prev]);
    });

    socket.on('ticket:updated', (ticket: Ticket) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, ...ticket } : t)),
      );
    });

    return () => {
      socket.off('ticket:created');
      socket.off('ticket:updated');
    };
  }, []);

  return (
    <div>
      <PageTitle
        title="Meus chamados"
        subtitle="Acompanhe apenas os tickets que você abriu"
        action={
          <Link href="/tickets/new">
            <Button>Novo chamado</Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-surface-light text-muted hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted">Nenhum chamado encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
