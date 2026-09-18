import Link from 'next/link';
import type { Ticket } from '@/types';
import { PriorityBadge, StatusBadge } from './Badges';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="block rounded-xl border border-slate-800 bg-surface-light p-5 transition hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-semibold text-white">{ticket.title}</h3>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-muted">{ticket.description}</p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{ticket.creator.name}</span>
        <div className="flex items-center gap-3">
          <PriorityBadge priority={ticket.priority} />
          {ticket._count && <span>{ticket._count.comments} comentários</span>}
        </div>
      </div>
    </Link>
  );
}
