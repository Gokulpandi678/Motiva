import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { relationshipService } from './relationship.service';
import type {
  CreateRelationshipInput,
  DueFollowUpsQuery,
  ListRelationshipsQuery,
  SearchPeopleQuery,
  UpdateRelationshipInput,
} from './relationship.validation';

export const createRelationship = asyncHandler(async (req, res) => {
  const relationship = await relationshipService.createRelationship(
    req.user!.id,
    req.body as CreateRelationshipInput,
  );
  sendSuccess(res, relationship, 201);
});

export const listRelationships = asyncHandler(async (req, res) => {
  const { relationships, meta } = await relationshipService.listRelationships(
    req.user!.id,
    req.query as unknown as ListRelationshipsQuery,
  );
  sendSuccess(res, relationships, 200, meta);
});

export const listDueFollowUps = asyncHandler(async (req, res) => {
  const { relationships, meta } = await relationshipService.listDueFollowUps(
    req.user!.id,
    req.query as unknown as DueFollowUpsQuery,
  );
  sendSuccess(res, relationships, 200, meta);
});

export const getRelationship = asyncHandler(async (req, res) => {
  const relationship = await relationshipService.getRelationshipById(req.user!.id, req.params.id as string);
  sendSuccess(res, relationship);
});

export const updateRelationship = asyncHandler(async (req, res) => {
  const relationship = await relationshipService.updateRelationship(
    req.user!.id,
    req.params.id as string,
    req.body as UpdateRelationshipInput,
  );
  sendSuccess(res, relationship);
});

export const deleteRelationship = asyncHandler(async (req, res) => {
  await relationshipService.deleteRelationship(req.user!.id, req.params.id as string);
  res.status(204).send();
});

export const searchPeople = asyncHandler(async (req, res) => {
  const { q, limit } = req.query as unknown as SearchPeopleQuery;
  const people = await relationshipService.searchPeople(req.user!.id, q, limit);
  sendSuccess(res, people);
});
