import { createServer } from 'http';
import { validateEnv, env } from './config/env.js';
import app from './app.js';
import { setupSocketIO } from './socket/index.js';
import prisma from './lib/prisma.js';

// Validate environment variables
validateEnv();

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = setupSocketIO(server);

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down gracefully...');

  // Close Socket.IO
  io.close();

  // Disconnect from database
  await prisma.$disconnect();

  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
server.listen(env.port, () => {
  console.log(`
🚀 Server running on port ${env.port}
📝 Environment: ${env.nodeEnv}
🔗 API: http://localhost:${env.port}/api
❤️  Health: http://localhost:${env.port}/health
  `);
});

export { io };
