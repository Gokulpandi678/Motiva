'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { faqService } from '../services/faq.service';
import { parseWith } from '../http/validate';
import { faqIdParamSchema, updateFaqSchema, type UpdateFaqInput } from '../validation/faq.validation';

export async function updateFaqAction(accessToken: string, id: string, input: UpdateFaqInput) {
  return runAction('updateFaq', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(faqIdParamSchema, { id });
    const validInput = parseWith(updateFaqSchema, input);
    return faqService.updateFaq(user.id, validId, validInput);
  });
}

export async function deleteFaqAction(accessToken: string, id: string) {
  return runAction('deleteFaq', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(faqIdParamSchema, { id });
    await faqService.deleteFaq(user.id, validId);
  });
}
