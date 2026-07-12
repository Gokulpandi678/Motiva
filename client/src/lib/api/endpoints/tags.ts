import { requestItem, requestVoid } from '../request';
import type { Tag } from '@/types/common';
import type { MergeTagInput, RenameTagInput, SearchTagsQuery, TagWithUsage } from '@/types/tag';

export const tagsApi = {
  search(query: SearchTagsQuery): Promise<TagWithUsage[]> {
    return requestItem<TagWithUsage[]>({ url: '/tags', method: 'GET', params: query });
  },

  rename(id: string, input: RenameTagInput): Promise<Tag> {
    return requestItem<Tag>({ url: `/tags/${id}`, method: 'PATCH', data: input });
  },

  merge(id: string, input: MergeTagInput): Promise<Tag> {
    return requestItem<Tag>({ url: `/tags/${id}/merge`, method: 'POST', data: input });
  },

  remove(id: string): Promise<void> {
    return requestVoid({ url: `/tags/${id}`, method: 'DELETE' });
  },
};
