import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { createLearningSchema, listLearningsQuerySchema } from '@/server/validation/learning.validation';
import { learningService } from '@/server/services/learning.service';

export const runtime = 'nodejs';

export const POST = withAuth(async (request, { user }) => {
  const input = parseWith(createLearningSchema, await request.json());
  const learning = await learningService.createLearning(user.id, input);
  return apiSuccess(learning, { status: 201 });
});

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(listLearningsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { learnings, meta } = await learningService.listLearnings(user.id, query);
  return apiSuccess(learnings, { meta });
});
