import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { EventsModule } from '../websocket/events.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EventsModule, AuthModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
