'use client';

import { ResourcePage } from '@/components/resource/ResourcePage';
import { faqQueries } from '@/hooks/queries/useFaqs';
import type { FaqListQuery } from '@/types/faq';
import { faqResourceConfig } from './faq.resource';

const PAGE_SIZE = 20;

export function FaqsPage() {
  const buildQuery = (filters: Record<string, string>, page: number): FaqListQuery => ({
    page,
    limit: PAGE_SIZE,
    search: filters.search || undefined,
  });

  return (
    <ResourcePage
      config={faqResourceConfig}
      hooks={faqQueries}
      buildQuery={buildQuery}
      description="Your personal knowledge base — generated from resolved tickets, refined here."
    />
  );
}
