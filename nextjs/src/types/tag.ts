export interface TagWithUsage {
  id: string;
  name: string;
  createdAt: string;
  ticketCount: number;
  learningCount: number;
  usageCount: number;
}

export interface SearchTagsQuery {
  q?: string;
  limit?: number;
}

export interface RenameTagInput {
  name: string;
}

export interface MergeTagInput {
  targetTagId: string;
}
