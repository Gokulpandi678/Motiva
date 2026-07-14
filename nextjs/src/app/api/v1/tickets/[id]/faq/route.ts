import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { parseWith } from '@/server/http/validate';
import { ticketIdParamSchema } from '@/server/validation/faq.validation';
import { faqService } from '@/server/services/faq.service';

export const runtime = 'nodejs';

type Params = { id: string };

// Generates (or regenerates, overwriting) the FAQ derived from this ticket.
export const POST = withAuth<Params>(async (_request, { user, params }) => {
  const { id } = parseWith(ticketIdParamSchema, await params);
  const faq = await faqService.generateFromTicket(user.id, id);
  return apiSuccess(faq, { status: 201 });
});
