import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCommentDto,
  CreateTicketDto,
  UpdateTicketDto,
} from './dto/ticket.dto';
import { TicketStatus } from '@prisma/client';
import type { AuthUser } from '../auth/auth.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: TicketStatus, user?: AuthUser) {
    return this.prisma.ticket.findMany({
      where: { ...(status ? { status } : {}), ...(user?.role === 'USER' ? { creatorId: user.id } : {}) },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user?: AuthUser) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Chamado ${id} não encontrado`);
    }
    if (user?.role === 'USER' && ticket.creatorId !== user.id) {
      throw new ForbiddenException('Você só pode acessar seus próprios chamados');
    }

    return ticket;
  }

  create(dto: CreateTicketDto, creatorId: string) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        category: dto.category,
        creatorId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(id: string, dto: UpdateTicketDto, user: AuthUser) {
    if (user.role === 'USER') throw new ForbiddenException('Apenas suporte e administradores podem atualizar chamados');
    await this.findOne(id, user);

    return this.prisma.ticket.update({
      where: { id },
      data: dto,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async addComment(ticketId: string, dto: CreateCommentDto, user: AuthUser) {
    await this.findOne(ticketId, user);

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        ticketId,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getStats(user?: AuthUser) {
    const where = user?.role === 'USER' ? { creatorId: user.id } : undefined;
    const [total, open, inProgress, resolved, closed] = await Promise.all([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.count({ where: { ...where, status: 'OPEN' } }),
      this.prisma.ticket.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      this.prisma.ticket.count({ where: { ...where, status: 'RESOLVED' } }),
      this.prisma.ticket.count({ where: { ...where, status: 'CLOSED' } }),
    ]);

    return { total, open, inProgress, resolved, closed };
  }
}
