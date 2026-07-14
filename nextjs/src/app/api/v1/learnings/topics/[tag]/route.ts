import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { topicParamSchema } from '@/server/validation/learning.validation';
import { learningTopicService } from '@/server/services/learning-topic.service';

export const runtime = 'nodejs';

type Params = { tag: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { tag } = parseWith(topicParamSchema, await params);
  const timeline = await learningTopicService.getTopicTimeline(user.id, tag);
  return apiSuccess(timeline);
});
