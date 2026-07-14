import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { relationshipIdParamSchema, updateRelationshipSchema } from '@/server/validation/relationship.validation';
import { relationshipService } from '@/server/services/relationship.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(relationshipIdParamSchema, await params);
  const relationship = await relationshipService.getRelationshipById(user.id, id);
  return apiSuccess(relationship);
});

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(relationshipIdParamSchema, await params);
  const input = parseWith(updateRelationshipSchema, await request.json());
  const relationship = await relationshipService.updateRelationship(user.id, id, input);
  return apiSuccess(relationship);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(relationshipIdParamSchema, await params);
  await relationshipService.deleteRelationship(user.id, id);
  return new NextResponse(null, { status: 204 });
});
