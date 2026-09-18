import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log('WebSocket gateway inicializado');
  }

  emitTicketCreated(ticket: unknown) {
    this.server.emit('ticket:created', ticket);
  }

  emitTicketUpdated(ticket: unknown) {
    this.server.emit('ticket:updated', ticket);
  }

  emitCommentAdded(ticketId: string, comment: unknown) {
    this.server.emit('comment:added', { ticketId, comment });
  }
}
