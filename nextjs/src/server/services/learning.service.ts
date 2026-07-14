import { NotFoundError } from '../common/errors';
import type { PaginationMeta } from '../http/response';
import { buildPaginationMeta, toSkip } from '../http/pagination';
import { learningRepository, type LearningWithTags } from '../repositories/learning.repository';
import type {
  CreateLearningInput,
  ListLearningsQuery,
  LowConfidenceQuery,
  UpdateLearningInput,
} from '../validation/learning.validation';

class LearningService {
  async createLearning(userId: string, input: CreateLearningInput): Promise<LearningWithTags> {
    return learningRepository.create(userId, input);
  }

  async listLearnings(
    userId: string,
    query: ListLearningsQuery,
  ): Promise<{ learnings: LearningWithTags[]; meta: PaginationMeta }> {
    const filter = { tag: query.tag, domain: query.domain };
    const pagination = { page: query.page, limit: query.limit };

    const [learnings, total] = await Promise.all([
      learningRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      learningRepository.count(userId, filter),
    ]);

    return { learnings, meta: buildPaginationMeta(total, pagination) };
  }

  async listLowConfidence(
    userId: string,
    query: LowConfidenceQuery,
  ): Promise<{ learnings: LearningWithTags[]; meta: PaginationMeta }> {
    const filter = { maxConfidence: query.threshold };
    const pagination = { page: query.page, limit: query.limit };

    const [learnings, total] = await Promise.all([
      learningRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      learningRepository.count(userId, filter),
    ]);

    return { learnings, meta: buildPaginationMeta(total, pagination) };
  }

  async getLearningById(userId: string, id: string): Promise<LearningWithTags> {
    const learning = await learningRepository.findById(userId, id);
    if (!learning) throw new NotFoundError(`Learning ${id} not found`);
    return learning;
  }

  async updateLearning(userId: string, id: string, input: UpdateLearningInput): Promise<LearningWithTags> {
    await this.getLearningById(userId, id);
    return learningRepository.update(userId, id, input);
  }

  async deleteLearning(userId: string, id: string): Promise<void> {
    await this.getLearningById(userId, id);
    await learningRepository.delete(userId, id);
  }
}

export const learningService = new LearningService();
