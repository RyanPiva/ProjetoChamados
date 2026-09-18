import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './websocket/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, TicketsModule, EventsModule, AuthModule],
})
export class AppModule {}
