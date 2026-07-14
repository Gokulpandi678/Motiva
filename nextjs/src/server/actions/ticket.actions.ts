'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { ticketService } from '../services/ticket.service';
import { faqService } from '../services/faq.service';
import { parseWith } from '../http/validate';
import { createTicketSchema, ticketIdParamSchema, updateTicketSchema } from '../validation/ticket.validation';
import { createActivitySchema, activityIdParamSchema } from '../validation/ticket-activity.validation';

// Same `createTicketSchema` validation the REST route runs — without this,
// the action path would skip coercion (e.g. a raw date string) and the
// length/shape checks the REST path enforces, silently diverging from it.
export async function createTicketAction(accessToken: string, input: unknown) {
  return runAction('createTicket', async () => {
    const user = await requireAuthFromToken(accessToken);
    const validInput = parseWith(createTicketSchema, input);
    return ticketService.createTicket(user.id, validInput);
  });
}

export async function updateTicketAction(accessToken: string, id: string, input: unknown) {
  return runAction('updateTicket', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(ticketIdParamSchema, { id });
    const validInput = parseWith(updateTicketSchema, input);
    return ticketService.updateTicket(user.id, validId, validInput);
  });
}

export async function deleteTicketAction(accessToken: string, id: string) {
  return runAction('deleteTicket', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(ticketIdParamSchema, { id });
    await ticketService.deleteTicket(user.id, validId);
  });
}

export async function generateFaqAction(accessToken: string, ticketId: string) {
  return runAction('generateFaq', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id } = parseWith(ticketIdParamSchema, { id: ticketId });
    return faqService.generateFromTicket(user.id, id);
  });
}

export async function addActivityAction(accessToken: string, ticketId: string, input: unknown) {
  return runAction('addActivity', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id } = parseWith(ticketIdParamSchema, { id: ticketId });
    const { type, note } = parseWith(createActivitySchema, input);
    return ticketService.addActivity(user.id, id, type, note);
  });
}

export async function removeActivityAction(accessToken: string, ticketId: string, activityId: string) {
  return runAction('removeActivity', async () => {
    const user = await requireAuthFromToken(accessToken);
    const parsed = parseWith(activityIdParamSchema, { id: ticketId, activityId });
    await ticketService.deleteActivity(user.id, parsed.id, parsed.activityId);
  });
}
