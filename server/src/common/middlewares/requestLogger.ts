import morgan from 'morgan';
import { logger } from '../../config/logger';

export const requestLogger = morgan('short', {
  stream: {
    write: (message: string) => logger.http(message.trim()),
  },
});
