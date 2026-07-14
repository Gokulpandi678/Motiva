import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { ticketIdParamSchema, updateTicketSchema } from '@/server/validation/ticket.validation';
import { ticketService } from '@/server/services/ticket.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  const ticket = await ticketService.getTicketById(user.id, id);
  return apiSuccess(ticket);
});

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  const input = parseWith(updateTicketSchema, await request.json());
  const ticket = await ticketService.updateTicket(user.id, id, input);
  return apiSuccess(ticket);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  await ticketService.deleteTicket(user.id, id);
  return new NextResponse(null, { status: 204 });
});
