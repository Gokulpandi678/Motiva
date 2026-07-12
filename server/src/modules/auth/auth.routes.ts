import { Router } from 'express';
import { validate } from '../../common/middlewares/validate';
import { requireAuth } from '../../common/middlewares/requireAuth';
import * as authController from './auth.controller';
import { callbackQuerySchema, refreshBodySchema } from './auth.validation';

export const authRoutes = Router();

authRoutes.get('/login', authController.login);
authRoutes.get('/callback', validate({ query: callbackQuerySchema }), authController.callback);
authRoutes.post('/refresh', validate({ body: refreshBodySchema }), authController.refresh);
authRoutes.post('/logout', authController.logout);
authRoutes.get('/me', requireAuth, authController.me);
