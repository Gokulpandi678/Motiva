import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { tagService } from './tag.service';
import type { MergeTagInput, RenameTagInput, SearchTagsQuery } from './tag.validation';

export const searchTags = asyncHandler(async (req, res) => {
  const { q, limit } = req.query as unknown as SearchTagsQuery;
  const tags = await tagService.search(req.user!.id, q, limit);
  sendSuccess(res, tags);
});

export const renameTag = asyncHandler(async (req, res) => {
  const { name } = req.body as RenameTagInput;
  const tag = await tagService.renameTag(req.user!.id, req.params.id as string, name);
  sendSuccess(res, tag);
});

export const mergeTag = asyncHandler(async (req, res) => {
  const { targetTagId } = req.body as MergeTagInput;
  const tag = await tagService.mergeTag(req.user!.id, req.params.id as string, targetTagId);
  sendSuccess(res, tag);
});

export const deleteTag = asyncHandler(async (req, res) => {
  await tagService.deleteTag(req.user!.id, req.params.id as string);
  res.status(204).send();
});
