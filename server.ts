/**
 * Custom Next.js Server with Socket.IO
 * This server handles real-time file upload notifications
 */

import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('[Socket.IO] Client connected:', socket.id);

    // Join a session room
    socket.on('join_session', (sessionId: string) => {
      socket.join(sessionId);
      console.log(`[Socket.IO] Client ${socket.id} joined session: ${sessionId}`);
    });

    // Leave a session room
    socket.on('leave_session', (sessionId: string) => {
      socket.leave(sessionId);
      console.log(`[Socket.IO] Client ${socket.id} left session: ${sessionId}`);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.IO] Client disconnected:', socket.id);
    });
  });

  // Make io instance globally accessible
  (global as any).io = io;

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
