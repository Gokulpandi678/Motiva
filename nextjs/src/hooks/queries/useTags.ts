import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '@/lib/api/endpoints/tags';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { unwrapAction } from '@/lib/actions/unwrapAction';
import { renameTagAction, mergeTagAction, deleteTagAction } from '@/server/actions/tag.actions';
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

// Mutations below now call the Server Action directly (instead of the axios
// `tagsApi.*` REST call) — same as every other resource's create/update/
// delete. The REST routes under /api/v1/tags stay live for Postman/external
// use; this is additive, not a replacement. `unwrapAction` re-throws the
// same `ApiError` shape the REST path did, so `onError`/toast handling at
// every call site (TagsPage) needed no changes.

export function useRenameTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RenameTagInput }) =>
      renameTagAction(tokenStorage.getAccessToken() ?? '', id, input).then(unwrapAction),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}

export function useMergeTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MergeTagInput }) =>
      mergeTagAction(tokenStorage.getAccessToken() ?? '', id, input).then(unwrapAction),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTagAction(tokenStorage.getAccessToken() ?? '', id).then(unwrapAction),
    onSuccess: () => invalidateEverythingTagRelated(queryClient),
  });
}
