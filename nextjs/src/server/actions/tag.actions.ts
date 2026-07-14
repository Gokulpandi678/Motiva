'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { tagService } from '../services/tag.service';
import { parseWith } from '../http/validate';
import { mergeTagSchema, renameTagSchema, tagIdParamSchema, type MergeTagInput, type RenameTagInput } from '../validation/tag.validation';

export async function renameTagAction(accessToken: string, id: string, input: RenameTagInput) {
  return runAction('renameTag', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(tagIdParamSchema, { id });
    const { name } = parseWith(renameTagSchema, input);
    return tagService.renameTag(user.id, validId, name);
  });
}

export async function mergeTagAction(accessToken: string, id: string, input: MergeTagInput) {
  return runAction('mergeTag', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(tagIdParamSchema, { id });
    const { targetTagId } = parseWith(mergeTagSchema, input);
    return tagService.mergeTag(user.id, validId, targetTagId);
  });
}

export async function deleteTagAction(accessToken: string, id: string) {
  return runAction('deleteTag', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(tagIdParamSchema, { id });
    await tagService.deleteTag(user.id, validId);
  });
}
