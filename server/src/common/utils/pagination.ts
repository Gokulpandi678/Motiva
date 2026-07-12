import type { PaginationMeta } from './apiResponse';

export interface PaginationQuery {
  page: number;
  limit: number;
}

export function toSkip({ page, limit }: PaginationQuery): number {
  return (page - 1) * limit;
}

export function buildPaginationMeta(
  total: number,
  { page, limit }: PaginationQuery,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
