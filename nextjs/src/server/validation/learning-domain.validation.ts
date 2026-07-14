import { z } from 'zod';

export const searchDomainsQuerySchema = z.object({
  q: z.string().trim().optional(),
  // Higher ceiling than most list endpoints — the domain admin view asks for
  // "all domains" in one request rather than paginating.
  limit: z.coerce.number().int().positive().max(500).default(10),
});
export type SearchDomainsQuery = z.infer<typeof searchDomainsQuerySchema>;

export const renameDomainSchema = z.object({
  from: z.string().trim().min(1).max(100),
  to: z.string().trim().min(1).max(100),
});
export type RenameDomainInput = z.infer<typeof renameDomainSchema>;
