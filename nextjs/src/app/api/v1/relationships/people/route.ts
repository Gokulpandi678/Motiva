import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { searchPeopleQuerySchema } from '@/server/validation/relationship.validation';
import { relationshipService } from '@/server/services/relationship.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const { q, limit } = parseWith(searchPeopleQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const people = await relationshipService.searchPeople(user.id, q, limit);
  return apiSuccess(people);
});
