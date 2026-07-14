import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { renameDomainSchema } from '@/server/validation/learning-domain.validation';
import { learningDomainService } from '@/server/services/learning-domain.service';

export const runtime = 'nodejs';

export const POST = withAuth(async (request, { user }) => {
  const { from, to } = parseWith(renameDomainSchema, await request.json());
  const result = await learningDomainService.renameDomain(user.id, from, to);
  return apiSuccess(result);
});
