import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { TicketsService } from './tickets.service';
import { EventsGateway } from '../websocket/events.gateway';
import {
  CreateCommentDto,
  CreateTicketDto,
  UpdateTicketDto,
} from './dto/ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { AuthUser } from '../auth/auth.service';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  findAll(@Query('status') status: TicketStatus | undefined, @Request() request: { user: AuthUser }) {
    return this.ticketsService.findAll(status, request.user);
  }

  @Get('stats')
  getStats(@Request() request: { user: AuthUser }) {
    return this.ticketsService.getStats(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: { user: AuthUser }) {
    return this.ticketsService.findOne(id, request.user);
  }

  @Post()
  async create(@Body() dto: CreateTicketDto, @Request() request: { user: AuthUser }) {
    const ticket = await this.ticketsService.create(dto, request.user.id);
    this.eventsGateway.emitTicketCreated(ticket);
    return ticket;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTicketDto, @Request() request: { user: AuthUser }) {
    const ticket = await this.ticketsService.update(id, dto, request.user);
    this.eventsGateway.emitTicketUpdated(ticket);
    return ticket;
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() request: { user: AuthUser },
  ) {
    const comment = await this.ticketsService.addComment(id, dto, request.user);
    this.eventsGateway.emitCommentAdded(id, comment);
    return comment;
  }
}
