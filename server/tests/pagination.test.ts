import { buildPaginationMeta, toSkip } from '../src/common/utils/pagination';

describe('pagination utils', () => {
  it('computes skip from page and limit', () => {
    expect(toSkip({ page: 1, limit: 20 })).toBe(0);
    expect(toSkip({ page: 3, limit: 20 })).toBe(40);
  });

  it('builds pagination meta with rounded-up total pages', () => {
    const meta = buildPaginationMeta(45, { page: 2, limit: 20 });
    expect(meta).toEqual({ page: 2, limit: 20, total: 45, totalPages: 3 });
  });

  it('never reports fewer than 1 total page, even with zero results', () => {
    const meta = buildPaginationMeta(0, { page: 1, limit: 20 });
    expect(meta.totalPages).toBe(1);
  });
});
