import { useQuery } from '@tanstack/react-query';
import { relationshipsApi } from '@/lib/api/endpoints/relationships';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import {
  createRelationshipAction,
  updateRelationshipAction,
  deleteRelationshipAction,
} from '@/server/actions/relationship.actions';
import type {
  CreateRelationshipInput,
  DueFollowUpsQuery,
  Relationship,
  RelationshipListQuery,
  UpdateRelationshipInput,
} from '@/types/relationship';
import type { SearchPeopleQuery } from '@/types/person';
import { createCrudQueries } from './createCrudQueries';

function accessToken(): string {
  return tokenStorage.getAccessToken() ?? '';
}

// create/update/remove now call the Server Action directly; list/getById
// still read through the REST endpoint. The REST routes stay live for
// Postman/external use — additive, not a replacement.
export const relationshipQueries = createCrudQueries<
  Relationship,
  RelationshipListQuery,
  CreateRelationshipInput,
  UpdateRelationshipInput
>({
  resourceKey: 'relationships',
  list: relationshipsApi.list,
  getById: relationshipsApi.getById,
  create: (input) => createRelationshipAction(accessToken(), input).then(unwrapAction),
  update: (id, input) => updateRelationshipAction(accessToken(), id, input).then(unwrapAction),
  remove: (id) => deleteRelationshipAction(accessToken(), id).then(unwrapAction),
});

export function useDueFollowUps(query: DueFollowUpsQuery) {
  return useQuery({
    queryKey: ['relationships', 'due-follow-ups', query],
    queryFn: () => relationshipsApi.listDueFollowUps(query),
  });
}

export function usePeopleSearch(query: SearchPeopleQuery, enabled = true) {
  return useQuery({
    queryKey: ['relationships', 'people', query],
    queryFn: () => relationshipsApi.searchPeople(query),
    enabled,
  });
}
