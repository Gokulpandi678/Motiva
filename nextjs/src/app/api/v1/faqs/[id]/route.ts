import { NextResponse } from 'next/server';
import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { faqIdParamSchema, updateFaqSchema } from '@/server/validation/faq.validation';
import { faqService } from '@/server/services/faq.service';

export const runtime = 'nodejs';

type Params = { id: string };

export const GET = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(faqIdParamSchema, await params);
  const faq = await faqService.getFaqById(user.id, id);
  return apiSuccess(faq);
});

export const PATCH = withAuth<Params>(async (request, { user, params }) => {
  const { id } = parseWith(faqIdParamSchema, await params);
  const input = parseWith(updateFaqSchema, await request.json());
  const faq = await faqService.updateFaq(user.id, id, input);
  return apiSuccess(faq);
});

export const DELETE = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(faqIdParamSchema, await params);
  await faqService.deleteFaq(user.id, id);
  return new NextResponse(null, { status: 204 });
});
