'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { learningService } from '../services/learning.service';
import { parseWith } from '../http/validate';
import { createLearningSchema, learningIdParamSchema, updateLearningSchema } from '../validation/learning.validation';

export async function createLearningAction(accessToken: string, input: unknown) {
  return runAction('createLearning', async () => {
    const user = await requireAuthFromToken(accessToken);
    const validInput = parseWith(createLearningSchema, input);
    return learningService.createLearning(user.id, validInput);
  });
}

export async function updateLearningAction(accessToken: string, id: string, input: unknown) {
  return runAction('updateLearning', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(learningIdParamSchema, { id });
    const validInput = parseWith(updateLearningSchema, input);
    return learningService.updateLearning(user.id, validId, validInput);
  });
}

export async function deleteLearningAction(accessToken: string, id: string) {
  return runAction('deleteLearning', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(learningIdParamSchema, { id });
    await learningService.deleteLearning(user.id, validId);
  });
}
