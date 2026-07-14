import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { ticketIdParamSchema } from '@/server/validation/ticket.validation';
import { createActivitySchema } from '@/server/validation/ticket-activity.validation';
import { ticketService } from '@/server/services/ticket.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  const activities = await ticketService.listActivities(user.id, id);
  return apiSuccess(activities);
});

export const POST = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  const { type, note } = parseWith(createActivitySchema, await request.json());
  const activity = await ticketService.addActivity(user.id, id, type, note);
  return apiSuccess(activity, { status: 201 });
});
