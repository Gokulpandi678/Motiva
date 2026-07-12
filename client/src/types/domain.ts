export interface DomainActivity {
  domain: string;
  count: number;
  lastUsedAt: string;
}

export interface SearchDomainsQuery {
  q?: string;
  limit?: number;
}

export interface RenameDomainInput {
  from: string;
  to: string;
}
