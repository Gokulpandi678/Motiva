import 'express';

interface AuthenticatedUser {
  id: string;
  workosUserId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireAuth`; guaranteed present on every route mounted after it. */
      user?: AuthenticatedUser;
    }
  }
}
