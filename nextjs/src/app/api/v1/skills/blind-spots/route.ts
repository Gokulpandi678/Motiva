import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { blindSpotsQuerySchema } from '@/server/validation/skill.validation';
import { skillService } from '@/server/services/skill.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const { days, limit } = parseWith(blindSpotsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const skills = await skillService.getBlindSpots(user.id, days, limit);
  return apiSuccess(skills);
});
