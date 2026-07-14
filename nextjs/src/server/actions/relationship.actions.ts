'use server';

import { runAction, requireAuthFromToken } from './actionResult';
import { relationshipService } from '../services/relationship.service';
import { parseWith } from '../http/validate';
import {
  createRelationshipSchema,
  relationshipIdParamSchema,
  updateRelationshipSchema,
} from '../validation/relationship.validation';

export async function createRelationshipAction(accessToken: string, input: unknown) {
  return runAction('createRelationship', async () => {
    const user = await requireAuthFromToken(accessToken);
    const validInput = parseWith(createRelationshipSchema, input);
    return relationshipService.createRelationship(user.id, validInput);
  });
}

export async function updateRelationshipAction(accessToken: string, id: string, input: unknown) {
  return runAction('updateRelationship', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(relationshipIdParamSchema, { id });
    const validInput = parseWith(updateRelationshipSchema, input);
    return relationshipService.updateRelationship(user.id, validId, validInput);
  });
}

export async function deleteRelationshipAction(accessToken: string, id: string) {
  return runAction('deleteRelationship', async () => {
    const user = await requireAuthFromToken(accessToken);
    const { id: validId } = parseWith(relationshipIdParamSchema, { id });
    await relationshipService.deleteRelationship(user.id, validId);
  });
}
