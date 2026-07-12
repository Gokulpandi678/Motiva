import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { learningsApi } from '@/lib/api/endpoints/learnings';
import type {
  CreateLearningInput,
  Learning,
  LearningListQuery,
  LowConfidenceQuery,
  UpdateLearningInput,
} from '@/types/learning';
import type { TopicsQuery } from '@/types/topic';
import type { RenameDomainInput, SearchDomainsQuery } from '@/types/domain';
import { createCrudQueries } from './createCrudQueries';

export const learningQueries = createCrudQueries<
  Learning,
  LearningListQuery,
  CreateLearningInput,
  UpdateLearningInput
>({
  resourceKey: 'learnings',
  list: learningsApi.list,
  getById: learningsApi.getById,
  create: learningsApi.create,
  update: learningsApi.update,
  remove: learningsApi.remove,
});

export function useLowConfidenceLearnings(query: LowConfidenceQuery) {
  return useQuery({
    queryKey: ['learnings', 'low-confidence', query],
    queryFn: () => learningsApi.listLowConfidence(query),
  });
}

export function useTopics(query: TopicsQuery) {
  return useQuery({
    queryKey: ['learnings', 'topics', query],
    queryFn: () => learningsApi.getTopics(query),
  });
}

export function useTopicTimeline(tag: string | undefined) {
  return useQuery({
    queryKey: ['learnings', 'topics', 'timeline', tag],
    queryFn: () => learningsApi.getTopicTimeline(tag as string),
    enabled: Boolean(tag),
  });
}

export function useDomainSearch(query: SearchDomainsQuery, enabled = true) {
  return useQuery({
    queryKey: ['learnings', 'domains', query],
    queryFn: () => learningsApi.listDomains(query),
    enabled,
  });
}

export function useRenameDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RenameDomainInput) => learningsApi.renameDomain(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learnings'] });
    },
  });
}
