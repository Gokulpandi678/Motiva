import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { mergeTagSchema, tagIdParamSchema } from '@/server/validation/tag.validation';
import { tagService } from '@/server/services/tag.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const POST = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(tagIdParamSchema, await params);
  const { targetTagId } = parseWith(mergeTagSchema, await request.json());
  const tag = await tagService.mergeTag(user.id, id, targetTagId);
  return apiSuccess(tag);
});
