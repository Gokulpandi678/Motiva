import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '@/lib/api/endpoints/tags';
import type { MergeTagInput, RenameTagInput, SearchTagsQuery } from '@/types/tag';

export function useTagSearch(query: SearchTagsQuery, enabled = true) {
  return useQuery({
    queryKey: ['tags', 'search', query],
    queryFn: () => tagsApi.search(query),
    enabled,
  });
}

/**
 * Tag names are embedded in ticket/learning/skill/topic responses, so any
 * rename/merge/delete needs to invalidate all of those alongside the tag
 * list itself — not just `['tags']`.
 */
function invalidateEverythingTagRelated(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['tags'] });
  queryClient.invalidateQueries({ queryKey: ['tickets'] });
  queryClient.invalidateQueries({ queryKey: ['learnings'] });
  queryClient.invalidateQueries({ queryKey: ['skills'] });
}

export function useRenameTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RenameTagInput }) => tagsApi.rename(id, input),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}

export function useMergeTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MergeTagInput }) => tagsApi.merge(id, input),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsApi.remove(id),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}
