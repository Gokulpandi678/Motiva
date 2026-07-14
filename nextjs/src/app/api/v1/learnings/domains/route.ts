import type { NextRequest } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { searchDomainsQuerySchema } from '@/server/validation/learning-domain.validation';
import { learningDomainService } from '@/server/services/learning-domain.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { q, limit } = parseWith(searchDomainsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const domains = await learningDomainService.listDomains(user.id, q, limit);
  return apiSuccess(domains);
});
