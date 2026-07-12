import { z } from 'zod';

export const callbackQuerySchema = z.object({
  code: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});
export type CallbackQuery = z.infer<typeof callbackQuerySchema>;

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});
export type RefreshBody = z.infer<typeof refreshBodySchema>;
