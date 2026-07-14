import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListResult } from '@/types/common';

export interface CrudQueryConfig<T, ListQuery, CreateInput, UpdateInput> {
  /** Namespace for this resource's query keys, e.g. 'tickets'. */
  resourceKey: string;
  list: (query: ListQuery) => Promise<ListResult<T>>;
  getById: (id: string) => Promise<T>;
  create?: (input: CreateInput) => Promise<T>;
  update?: (id: string, input: UpdateInput) => Promise<T>;
  remove?: (id: string) => Promise<void>;
}

/**
 * One factory, reused for every CRUD resource (tickets, learnings, relationships,
 * faqs). Each resource module just supplies its API functions; the query-key
 * strategy, caching, and invalidation-on-mutation behavior stay identical across
 * all of them so pages never hand-roll their own data-fetching logic.
 */
export function createCrudQueries<T, ListQuery extends object, CreateInput, UpdateInput>(
  config: CrudQueryConfig<T, ListQuery, CreateInput, UpdateInput>,
) {
  const keys = {
    all: [config.resourceKey] as const,
    list: (query: ListQuery) => [config.resourceKey, 'list', query] as const,
    detail: (id: string) => [config.resourceKey, 'detail', id] as const,
  };

  function useList(query: ListQuery) {
    return useQuery({
      queryKey: keys.list(query),
      queryFn: () => config.list(query),
      placeholderData: keepPreviousData,
    });
  }

  function useById(id: string | undefined) {
    return useQuery({
      queryKey: keys.detail(id ?? ''),
      queryFn: () => config.getById(id as string),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: CreateInput) => {
        if (!config.create) throw new Error(`${config.resourceKey} does not support create`);
        return config.create(input);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateInput }) => {
        if (!config.update) throw new Error(`${config.resourceKey} does not support update`);
        return config.update(id, input);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => {
        if (!config.remove) throw new Error(`${config.resourceKey} does not support delete`);
        return config.remove(id);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
    });
  }

  return { keys, useList, useById, useCreate, useUpdate, useRemove };
}
