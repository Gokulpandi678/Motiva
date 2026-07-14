import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { parseWith } from '@/server/http/validate';
import { activityIdParamSchema } from '@/server/validation/ticket-activity.validation';
import { ticketService } from '@/server/services/ticket.service';

export const runtime = 'nodejs';

type Params = { id: string; activityId: string };

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id, activityId } = parseWith(activityIdParamSchema, await params);
  await ticketService.deleteActivity(user.id, id, activityId);
  return new NextResponse(null, { status: 204 });
});
