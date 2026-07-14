'use server';

import { runAction, requireAuthFromToken, type ActionResult } from './actionResult';
import { learningDomainService } from '../services/learning-domain.service';
import { parseWith } from '../http/validate';
import { renameDomainSchema, type RenameDomainInput } from '../validation/learning-domain.validation';

export async function renameDomainAction(
  accessToken: string,
  input: RenameDomainInput,
): Promise<ActionResult<{ updated: number }>> {
  return runAction('renameDomain', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { from, to } = parseWith(renameDomainSchema, input);
    return learningDomainService.renameDomain(user.id, from, to);
  });
}
