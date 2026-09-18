'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001';
    socket = io(wsUrl, { transports: ['websocket'] });
  }
  return socket;
}
