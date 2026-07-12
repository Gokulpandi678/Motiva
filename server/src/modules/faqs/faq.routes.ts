import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import * as faqController from './faq.controller';
import { faqIdParamSchema, listFaqsQuerySchema, updateFaqSchema } from './faq.validation';

export const faqRoutes = Router();

faqRoutes.get('/', validate({ query: listFaqsQuerySchema }), faqController.listFaqs);
faqRoutes.get('/:id', validate({ params: faqIdParamSchema }), faqController.getFaq);
faqRoutes.patch(
  '/:id',
  validate({ params: faqIdParamSchema, body: updateFaqSchema }),
  faqController.updateFaq,
);
faqRoutes.delete('/:id', validate({ params: faqIdParamSchema }), faqController.deleteFaq);
