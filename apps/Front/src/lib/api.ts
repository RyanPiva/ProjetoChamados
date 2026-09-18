import type {
  Comment,
  CreateCommentPayload,
  CreateTicketPayload,
  Ticket,
  TicketStats,
  TicketStatus,
  UpdateTicketPayload,
  User,
  LoginResponse,
} from '@/types';
import { getToken } from './auth';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').replace(/\/+$/, '');
const API_BASE = API_URL.endsWith('/api') ? API_URL.replace(/\/api$/, '') : API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${API_BASE}/api${normalizedPath}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Erro ${res.status}`);
  }

  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getTickets: (status?: TicketStatus) =>
    request<Ticket[]>(status ? `/tickets?status=${status}` : '/tickets'),

  getTicket: (id: string) => request<Ticket>(`/tickets/${id}`),

  getStats: () => request<TicketStats>('/tickets/stats'),

  createTicket: (data: CreateTicketPayload) =>
    request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTicket: (id: string, data: UpdateTicketPayload) =>
    request<Ticket>(`/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  addComment: (ticketId: string, data: CreateCommentPayload) =>
    request<Comment>(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUsers: () => request<User[]>('/users'),
};
