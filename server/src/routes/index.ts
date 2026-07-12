import { Router } from 'express';
import { requireAuth } from '../common/middlewares/requireAuth';
import { authRoutes } from '../modules/auth/auth.routes';
import { faqRoutes } from '../modules/faqs/faq.routes';
import { learningRoutes } from '../modules/learnings/learning.routes';
import { relationshipRoutes } from '../modules/relationships/relationship.routes';
import { skillRoutes } from '../modules/skills/skill.routes';
import { tagRoutes } from '../modules/tags/tag.routes';
import { taskRoutes } from '../modules/tasks/task.routes';
import { ticketRoutes } from '../modules/tickets/ticket.routes';

export const apiRouter = Router();

// Public — login/callback/refresh/logout must be reachable without a token.
apiRouter.use('/auth', authRoutes);

// Everything below requires a verified WorkOS access token.
apiRouter.use(requireAuth);

apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/faqs', faqRoutes);
apiRouter.use('/learnings', learningRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/relationships', relationshipRoutes);
apiRouter.use('/tags', tagRoutes);
apiRouter.use('/tasks', taskRoutes);
