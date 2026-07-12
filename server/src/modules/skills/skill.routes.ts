import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as skillController from './skill.controller';
import { blindSpotsQuerySchema } from './skill.validation';

export const skillRoutes = Router();

skillRoutes.get('/', skillController.getSkillGrowth);
skillRoutes.get(
  '/blind-spots',
  validate({ query: blindSpotsQuerySchema }),
  skillController.getBlindSpots,
);
