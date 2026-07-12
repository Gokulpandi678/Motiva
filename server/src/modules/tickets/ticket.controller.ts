import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { ticketService } from './ticket.service';
import type {
  CreateTicketInput,
  ListTicketsQuery,
  SimilarTicketsQuery,
  UpdateTicketInput,
} from './ticket.validation';
import type { CreateActivityInput } from './ticket-activity.validation';

export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.createTicket(req.user!.id, req.body as CreateTicketInput);
  sendSuccess(res, ticket, 201);
});

export const listTickets = asyncHandler(async (req, res) => {
  const { tickets, meta } = await ticketService.listTickets(req.user!.id, req.query as unknown as ListTicketsQuery);
  sendSuccess(res, tickets, 200, meta);
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getTicketById(req.user!.id, req.params.id as string);
  sendSuccess(res, ticket);
});

export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicket(
    req.user!.id,
    req.params.id as string,
    req.body as UpdateTicketInput,
  );
  sendSuccess(res, ticket);
});

export const deleteTicket = asyncHandler(async (req, res) => {
  await ticketService.deleteTicket(req.user!.id, req.params.id as string);
  res.status(204).send();
});

export const getSimilarTickets = asyncHandler(async (req, res) => {
  const { title, limit, excludeId } = req.query as unknown as SimilarTicketsQuery;
  const similar = await ticketService.findSimilarTickets(req.user!.id, title, limit, excludeId);
  sendSuccess(res, similar);
});

export const listActivities = asyncHandler(async (req, res) => {
  const activities = await ticketService.listActivities(req.user!.id, req.params.id as string);
  sendSuccess(res, activities);
});

export const addActivity = asyncHandler(async (req, res) => {
  const { type, note } = req.body as CreateActivityInput;
  const activity = await ticketService.addActivity(req.user!.id, req.params.id as string, type, note);
  sendSuccess(res, activity, 201);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  await ticketService.deleteActivity(req.user!.id, req.params.id as string, req.params.activityId as string);
  res.status(204).send();
});
