import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as learningController from './learning.controller';
import {
  createLearningSchema,
  learningIdParamSchema,
  listLearningsQuerySchema,
  lowConfidenceQuerySchema,
  renameDomainSchema,
  searchDomainsQuerySchema,
  topicParamSchema,
  topicsQuerySchema,
  updateLearningSchema,
} from './learning.validation';

export const learningRoutes = Router();

learningRoutes.post(
  '/',
  validate({ body: createLearningSchema }),
  learningController.createLearning,
);
learningRoutes.get(
  '/',
  validate({ query: listLearningsQuerySchema }),
  learningController.listLearnings,
);

// Must be registered before '/:id' so they aren't swallowed by the id route.
learningRoutes.get(
  '/low-confidence',
  validate({ query: lowConfidenceQuerySchema }),
  learningController.listLowConfidenceLearnings,
);

learningRoutes.get(
  '/topics',
  validate({ query: topicsQuerySchema }),
  learningController.listTopics,
);
learningRoutes.get(
  '/topics/:tag',
  validate({ params: topicParamSchema }),
  learningController.getTopicTimeline,
);

learningRoutes.get(
  '/domains',
  validate({ query: searchDomainsQuerySchema }),
  learningController.listDomains,
);
learningRoutes.post(
  '/domains/rename',
  validate({ body: renameDomainSchema }),
  learningController.renameDomain,
);

learningRoutes.get(
  '/:id',
  validate({ params: learningIdParamSchema }),
  learningController.getLearning,
);
learningRoutes.patch(
  '/:id',
  validate({ params: learningIdParamSchema, body: updateLearningSchema }),
  learningController.updateLearning,
);
learningRoutes.delete(
  '/:id',
  validate({ params: learningIdParamSchema }),
  learningController.deleteLearning,
);
