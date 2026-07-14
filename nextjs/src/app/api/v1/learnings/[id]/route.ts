import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { learningIdParamSchema, updateLearningSchema } from '@/server/validation/learning.validation';
import { learningService } from '@/server/services/learning.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(learningIdParamSchema, await params);
  const learning = await learningService.getLearningById(user.id, id);
  return apiSuccess(learning);
});

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(learningIdParamSchema, await params);
  const input = parseWith(updateLearningSchema, await request.json());
  const learning = await learningService.updateLearning(user.id, id, input);
  return apiSuccess(learning);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(learningIdParamSchema, await params);
  await learningService.deleteLearning(user.id, id);
  return new NextResponse(null, { status: 204 });
});
