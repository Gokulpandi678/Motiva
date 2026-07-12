import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import { generateFaqForTicket } from '../faqs/faq.controller';
import { ticketIdParamSchema as faqTicketIdParamSchema } from '../faqs/faq.validation';
import * as ticketController from './ticket.controller';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  similarTicketsQuerySchema,
  ticketIdParamSchema,
  updateTicketSchema,
} from './ticket.validation';
import { activityIdParamSchema, createActivitySchema } from './ticket-activity.validation';

export const ticketRoutes = Router();

ticketRoutes.post('/', validate({ body: createTicketSchema }), ticketController.createTicket);
ticketRoutes.get('/', validate({ query: listTicketsQuerySchema }), ticketController.listTickets);

// Must be registered before '/:id' so it isn't swallowed by the id route.
ticketRoutes.get(
  '/similar',
  validate({ query: similarTicketsQuerySchema }),
  ticketController.getSimilarTickets,
);

ticketRoutes.get('/:id', validate({ params: ticketIdParamSchema }), ticketController.getTicket);
ticketRoutes.patch(
  '/:id',
  validate({ params: ticketIdParamSchema, body: updateTicketSchema }),
  ticketController.updateTicket,
);
ticketRoutes.delete(
  '/:id',
  validate({ params: ticketIdParamSchema }),
  ticketController.deleteTicket,
);

// Generate (or regenerate) the FAQ entry derived from a resolved ticket.
ticketRoutes.post(
  '/:id/faq',
  validate({ params: faqTicketIdParamSchema }),
  generateFaqForTicket,
);

// The ticket's activity timeline.
ticketRoutes.get(
  '/:id/activities',
  validate({ params: ticketIdParamSchema }),
  ticketController.listActivities,
);
ticketRoutes.post(
  '/:id/activities',
  validate({ params: ticketIdParamSchema, body: createActivitySchema }),
  ticketController.addActivity,
);
ticketRoutes.delete(
  '/:id/activities/:activityId',
  validate({ params: activityIdParamSchema }),
  ticketController.deleteActivity,
);
