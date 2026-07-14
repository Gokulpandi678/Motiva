import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { learningsApi } from '@/lib/api/endpoints/learnings';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import { renameDomainAction } from '@/server/actions/learning-domain.actions';
import { createLearningAction, updateLearningAction, deleteLearningAction } from '@/server/actions/learning.actions';
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

function accessToken(): string {
  return tokenStorage.getAccessToken() ?? '';
}

// create/update/remove now call the Server Action directly; list/getById
// still read through the REST endpoint. The REST routes stay live for
// Postman/external use — additive, not a replacement.
export const learningQueries = createCrudQueries<
  Learning,
  LearningListQuery,
  CreateLearningInput,
  UpdateLearningInput
>({
  resourceKey: 'learnings',
  list: learningsApi.list,
  getById: learningsApi.getById,
  create: (input) => createLearningAction(accessToken(), input).then(unwrapAction),
  update: (id, input) => updateLearningAction(accessToken(), id, input).then(unwrapAction),
  remove: (id) => deleteLearningAction(accessToken(), id).then(unwrapAction),
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

// Calls the Server Action directly (not the axios `learningsApi.renameDomain`
// REST call) — see the equivalent note in `useTags.ts`. The REST route stays
// live for Postman/external use.
export function useRenameDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RenameDomainInput) => renameDomainAction(accessToken(), input).then(unwrapAction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learnings'] });
    },
  });
}
