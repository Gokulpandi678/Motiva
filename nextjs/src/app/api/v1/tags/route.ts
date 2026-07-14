import type { NextRequest } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { searchTagsQuerySchema } from '@/server/validation/tag.validation';
import { tagService } from '@/server/services/tag.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { q, limit } = parseWith(searchTagsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const tags = await tagService.search(user.id, q, limit);
  return apiSuccess(tags);
});
