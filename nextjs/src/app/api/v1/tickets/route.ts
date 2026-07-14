import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { createTicketSchema, listTicketsQuerySchema } from '@/server/validation/ticket.validation';
import { ticketService } from '@/server/services/ticket.service';

export const runtime = 'nodejs';

export const POST = withAuth(async (request, { user }) => {
  const input = parseWith(createTicketSchema, await request.json());
  const ticket = await ticketService.createTicket(user.id, input);
  return apiSuccess(ticket, { status: 201 });
});

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(listTicketsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { tickets, meta } = await ticketService.listTickets(user.id, query);
  return apiSuccess(tickets, { meta });
});
