import { z } from 'zod';

// Next.js loads `.env`/`.env.local` automatically for anything that runs
// through its own dev/build/start pipeline (unlike the old Express app,
// which had to call `dotenv.config()` itself). The one exception is the
// standalone migration script — see `db:migrate` in package.json, which
// loads dotenv itself before this module is imported.

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),

  // WorkOS AuthKit. Tokens are handed to the frontend and it stores + attaches
  // them itself (Authorization: Bearer <token>), so there is no cookie config
  // here at all — access/refresh token lifetimes are controlled by WorkOS's
  // own dashboard settings, not by this app.
  WORKOS_CLIENT_ID: z.string().min(1, 'WORKOS_CLIENT_ID is required'),
  WORKOS_API_KEY: z.string().min(1, 'WORKOS_API_KEY is required'),
  WORKOS_REDIRECT_URI: z.string().url('WORKOS_REDIRECT_URI must be an absolute URL'),

  // Where the browser is sent after WorkOS redirects back post-login, and
  // after logout. Must have a route that reads the token fragment (see
  // src/app/(auth)/auth/callback/page.tsx).
  WEB_APP_URL: z.string().url('WEB_APP_URL must be an absolute URL'),

  // How long a pending login attempt's PKCE state stays valid server-side
  // (see server/auth/oauthStateStore.ts) before the callback is rejected.
  OAUTH_STATE_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export type Env = typeof env;
