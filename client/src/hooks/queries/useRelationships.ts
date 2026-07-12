import { useQuery } from '@tanstack/react-query';
import { relationshipsApi } from '@/lib/api/endpoints/relationships';
import type {
  CreateRelationshipInput,
  DueFollowUpsQuery,
  Relationship,
  RelationshipListQuery,
  UpdateRelationshipInput,
} from '@/types/relationship';
import type { SearchPeopleQuery } from '@/types/person';
import { createCrudQueries } from './createCrudQueries';

export const relationshipQueries = createCrudQueries<
  Relationship,
  RelationshipListQuery,
  CreateRelationshipInput,
  UpdateRelationshipInput
>({
  resourceKey: 'relationships',
  list: relationshipsApi.list,
  getById: relationshipsApi.getById,
  create: relationshipsApi.create,
  update: relationshipsApi.update,
  remove: relationshipsApi.remove,
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
