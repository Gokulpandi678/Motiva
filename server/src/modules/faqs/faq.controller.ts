import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { faqService } from './faq.service';
import type { ListFaqsQuery, UpdateFaqInput } from './faq.validation';

export const generateFaqForTicket = asyncHandler(async (req, res) => {
  const faq = await faqService.generateFromTicket(req.user!.id, req.params.id as string);
  sendSuccess(res, faq, 201);
});

export const listFaqs = asyncHandler(async (req, res) => {
  const { faqs, meta } = await faqService.listFaqs(req.user!.id, req.query as unknown as ListFaqsQuery);
  sendSuccess(res, faqs, 200, meta);
});

export const getFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.getFaqById(req.user!.id, req.params.id as string);
  sendSuccess(res, faq);
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.user!.id, req.params.id as string, req.body as UpdateFaqInput);
  sendSuccess(res, faq);
});

export const deleteFaq = asyncHandler(async (req, res) => {
  await faqService.deleteFaq(req.user!.id, req.params.id as string);
  res.status(204).send();
});
