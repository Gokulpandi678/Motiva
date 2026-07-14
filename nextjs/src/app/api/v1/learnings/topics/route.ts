import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { topicsQuerySchema } from '@/server/validation/learning.validation';
import { learningTopicService } from '@/server/services/learning-topic.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const { domain } = parseWith(topicsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const topics = await learningTopicService.listTopics(user.id, domain);
  return apiSuccess(topics);
});
