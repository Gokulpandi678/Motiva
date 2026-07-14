import { requestItem, requestList, requestVoid } from '../request';
import type { ListResult } from '@/types/common';
import type {
  CreateRelationshipInput,
  DueFollowUpsQuery,
  Relationship,
  RelationshipListQuery,
  UpdateRelationshipInput,
} from '@/types/relationship';
import type { PersonSummary, SearchPeopleQuery } from '@/types/person';

export const relationshipsApi = {
  list(query: RelationshipListQuery): Promise<ListResult<Relationship>> {
    return requestList<Relationship>({ url: '/relationships', method: 'GET', params: query });
  },

  listDueFollowUps(query: DueFollowUpsQuery): Promise<ListResult<Relationship>> {
    return requestList<Relationship>({
      url: '/relationships/follow-ups/due',
      method: 'GET',
      params: query,
    });
  },

  getById(id: string): Promise<Relationship> {
    return requestItem<Relationship>({ url: `/relationships/${id}`, method: 'GET' });
  },

  create(input: CreateRelationshipInput): Promise<Relationship> {
    return requestItem<Relationship>({ url: '/relationships', method: 'POST', data: input });
  },

  update(id: string, input: UpdateRelationshipInput): Promise<Relationship> {
    return requestItem<Relationship>({ url: `/relationships/${id}`, method: 'PATCH', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/relationships/${id}`, method: 'DELETE' });
  },

  searchPeople(query: SearchPeopleQuery): Promise<PersonSummary[]> {
    return requestItem<PersonSummary[]>({ url: '/relationships/people', method: 'GET', params: query });
  },
};
