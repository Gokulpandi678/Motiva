import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { renameTagSchema, tagIdParamSchema } from '@/server/validation/tag.validation';
import { tagService } from '@/server/services/tag.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(tagIdParamSchema, await params);
  const { name } = parseWith(renameTagSchema, await request.json());
  const tag = await tagService.renameTag(user.id, id, name);
  return apiSuccess(tag);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(tagIdParamSchema, await params);
  await tagService.deleteTag(user.id, id);
  return new NextResponse(null, { status: 204 });
});
