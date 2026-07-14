import { z } from 'zod';

export const searchTagsQuerySchema = z.object({
  q: z.string().trim().optional(),
  // Higher ceiling than most list endpoints — the tag admin view asks for
  // "all tags" in one request rather than paginating.
  limit: z.coerce.number().int().positive().max(500).default(10),
});
export type SearchTagsQuery = z.infer<typeof searchTagsQuerySchema>;

export const tagIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const renameTagSchema = z.object({
  name: z.string().trim().min(1).max(100),
});
export type RenameTagInput = z.infer<typeof renameTagSchema>;

export const mergeTagSchema = z.object({
  targetTagId: z.string().uuid(),
});
export type MergeTagInput = z.infer<typeof mergeTagSchema>;
