import { URL } from 'node:url';
import { WorkOS } from '@workos-inc/node';
import { createRemoteJWKSet } from 'jose';
import { env } from '../../config/env';

/** Single shared WorkOS client, configured entirely from env — nothing here is hardcoded. */
export const workos = new WorkOS(env.WORKOS_API_KEY, { clientId: env.WORKOS_CLIENT_ID });

/**
 * jose caches the fetched keyset internally and re-fetches on a cache miss
 * (e.g. after WorkOS rotates signing keys), so this is safe to reuse for the
 * lifetime of the process rather than re-creating it per request.
 */
export const workosJwks = createRemoteJWKSet(new URL(workos.userManagement.getJwksUrl(env.WORKOS_CLIENT_ID)));
