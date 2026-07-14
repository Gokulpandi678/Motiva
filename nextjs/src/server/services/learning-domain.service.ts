import { BadRequestError } from '../common/errors';
import { learningDomainRepository, type DomainActivity } from '../repositories/learning-domain.repository';

class LearningDomainService {
  /** Sorted most-recently-used first, so the frontend can default a new entry to `domains[0]`. */
  async listDomains(userId: string, query: string | undefined, limit: number): Promise<DomainActivity[]> {
    const domains = await learningDomainRepository.listDomains(userId, query);
    return domains.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime()).slice(0, limit);
  }

  async renameDomain(userId: string, from: string, to: string): Promise<{ updated: number }> {
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();

    if (!trimmedFrom || !trimmedTo) throw new BadRequestError('Domain names cannot be empty');
    if (trimmedFrom === trimmedTo) return { updated: 0 };

    const updated = await learningDomainRepository.renameDomain(userId, trimmedFrom, trimmedTo);
    return { updated };
  }
}

export const learningDomainService = new LearningDomainService();
