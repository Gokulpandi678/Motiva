import { requestItem, requestList, requestVoid } from '../request';
import type { ListResult } from '@/types/common';
import type {
  CreateLearningInput,
  Learning,
  LearningListQuery,
  LowConfidenceQuery,
  UpdateLearningInput,
} from '@/types/learning';
import type { TopicSummary, TopicsQuery, TopicTimeline } from '@/types/topic';
import type { DomainActivity, RenameDomainInput, SearchDomainsQuery } from '@/types/domain';

export const learningsApi = {
  list(query: LearningListQuery): Promise<ListResult<Learning>> {
    return requestList<Learning>({ url: '/learnings', method: 'GET', params: query });
  },

  listLowConfidence(query: LowConfidenceQuery): Promise<ListResult<Learning>> {
    return requestList<Learning>({ url: '/learnings/low-confidence', method: 'GET', params: query });
  },

  getById(id: string): Promise<Learning> {
    return requestItem<Learning>({ url: `/learnings/${id}`, method: 'GET' });
  },

  create(input: CreateLearningInput): Promise<Learning> {
    return requestItem<Learning>({ url: '/learnings', method: 'POST', data: input });
  },

  update(id: string, input: UpdateLearningInput): Promise<Learning> {
    return requestItem<Learning>({ url: `/learnings/${id}`, method: 'PATCH', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/learnings/${id}`, method: 'DELETE' });
  },

  getTopics(query: TopicsQuery): Promise<TopicSummary[]> {
    return requestItem<TopicSummary[]>({ url: '/learnings/topics', method: 'GET', params: query });
  },

  getTopicTimeline(tag: string): Promise<TopicTimeline> {
    return requestItem<TopicTimeline>({ url: `/learnings/topics/${encodeURIComponent(tag)}`, method: 'GET' });
  },

  listDomains(query: SearchDomainsQuery): Promise<DomainActivity[]> {
    return requestItem<DomainActivity[]>({ url: '/learnings/domains', method: 'GET', params: query });
  },

  renameDomain(input: RenameDomainInput): Promise<{ updated: number }> {
    return requestItem<{ updated: number }>({ url: '/learnings/domains/rename', method: 'POST', data: input });
  },
};
