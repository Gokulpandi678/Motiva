import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as relationshipController from './relationship.controller';
import {
  createRelationshipSchema,
  dueFollowUpsQuerySchema,
  listRelationshipsQuerySchema,
  relationshipIdParamSchema,
  searchPeopleQuerySchema,
  updateRelationshipSchema,
} from './relationship.validation';

export const relationshipRoutes = Router();

relationshipRoutes.post(
  '/',
  validate({ body: createRelationshipSchema }),
  relationshipController.createRelationship,
);
relationshipRoutes.get(
  '/',
  validate({ query: listRelationshipsQuerySchema }),
  relationshipController.listRelationships,
);

// Must be registered before '/:id' so they aren't swallowed by the id route.
relationshipRoutes.get(
  '/follow-ups/due',
  validate({ query: dueFollowUpsQuerySchema }),
  relationshipController.listDueFollowUps,
);
relationshipRoutes.get(
  '/people',
  validate({ query: searchPeopleQuerySchema }),
  relationshipController.searchPeople,
);

relationshipRoutes.get(
  '/:id',
  validate({ params: relationshipIdParamSchema }),
  relationshipController.getRelationship,
);
relationshipRoutes.patch(
  '/:id',
  validate({ params: relationshipIdParamSchema, body: updateRelationshipSchema }),
  relationshipController.updateRelationship,
);
relationshipRoutes.delete(
  '/:id',
  validate({ params: relationshipIdParamSchema }),
  relationshipController.deleteRelationship,
);
