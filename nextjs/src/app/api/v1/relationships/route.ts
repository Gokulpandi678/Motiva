import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { createRelationshipSchema, listRelationshipsQuerySchema } from '@/server/validation/relationship.validation';
import { relationshipService } from '@/server/services/relationship.service';

export const runtime = 'nodejs';

export const POST = withAuth(async (request, { user }) => {
  const input = parseWith(createRelationshipSchema, await request.json());
  const relationship = await relationshipService.createRelationship(user.id, input);
  return apiSuccess(relationship, { status: 201 });
});

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(listRelationshipsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { relationships, meta } = await relationshipService.listRelationships(user.id, query);
  return apiSuccess(relationships, { meta });
});
