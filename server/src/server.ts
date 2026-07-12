import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { pool } from './config/db';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});
