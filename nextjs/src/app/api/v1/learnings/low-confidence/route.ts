import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { lowConfidenceQuerySchema } from '@/server/validation/learning.validation';
import { learningService } from '@/server/services/learning.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(lowConfidenceQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { learnings, meta } = await learningService.listLowConfidence(user.id, query);
  return apiSuccess(learnings, { meta });
});
