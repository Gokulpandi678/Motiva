import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { similarTicketsQuerySchema } from '@/server/validation/ticket.validation';
import { ticketService } from '@/server/services/ticket.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const { title, limit, excludeId } = parseWith(
    similarTicketsQuerySchema,
    searchParamsToObject(request.nextUrl.searchParams),
  );
  const similar = await ticketService.findSimilarTickets(user.id, title, limit, excludeId);
  return apiSuccess(similar);
});
