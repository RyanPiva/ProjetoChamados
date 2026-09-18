export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type UserRole = 'ADMIN' | 'AGENT' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string | null;
  createdAt: string;
  updatedAt: string;
  creator: Pick<User, 'id' | 'name' | 'email'>;
  assignee?: Pick<User, 'id' | 'name' | 'email'> | null;
  _count?: { comments: number };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<User, 'id' | 'name' | 'email'>;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: TicketPriority;
  category?: string;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string | null;
}

export interface CreateCommentPayload {
  content: string;
}
