import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { dueFollowUpsQuerySchema } from '@/server/validation/relationship.validation';
import { relationshipService } from '@/server/services/relationship.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(dueFollowUpsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { relationships, meta } = await relationshipService.listDueFollowUps(user.id, query);
  return apiSuccess(relationships, { meta });
});
