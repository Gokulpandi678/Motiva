import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith, searchParamsToObject } from '@/server/http/validate';
import { listFaqsQuerySchema } from '@/server/validation/faq.validation';
import { faqService } from '@/server/services/faq.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (request, { user }) => {
  const query = parseWith(listFaqsQuerySchema, searchParamsToObject(request.nextUrl.searchParams));
  const { faqs, meta } = await faqService.listFaqs(user.id, query);
  return apiSuccess(faqs, { meta });
});
