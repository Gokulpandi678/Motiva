import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as tagController from './tag.controller';
import { mergeTagSchema, renameTagSchema, searchTagsQuerySchema, tagIdParamSchema } from './tag.validation';

export const tagRoutes = Router();

tagRoutes.get('/', validate({ query: searchTagsQuerySchema }), tagController.searchTags);
tagRoutes.patch(
  '/:id',
  validate({ params: tagIdParamSchema, body: renameTagSchema }),
  tagController.renameTag,
);
tagRoutes.post(
  '/:id/merge',
  validate({ params: tagIdParamSchema, body: mergeTagSchema }),
  tagController.mergeTag,
);
tagRoutes.delete('/:id', validate({ params: tagIdParamSchema }), tagController.deleteTag);
