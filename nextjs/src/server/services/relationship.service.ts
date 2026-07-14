import type { InteractionType } from '../common/enums';
import type { Relationship } from '../common/types/models';
import { NotFoundError } from '../common/errors';
import type { PaginationMeta } from '../http/response';
import { buildPaginationMeta, toSkip } from '../http/pagination';
import { relationshipRepository } from '../repositories/relationship.repository';
import type {
  CreateRelationshipInput,
  DueFollowUpsQuery,
  ListRelationshipsQuery,
  UpdateRelationshipInput,
} from '../validation/relationship.validation';

export interface PersonSummary {
  personName: string;
  lastInteractionType: InteractionType;
  lastInteractionAt: Date;
  lastContext: string | null;
}

class RelationshipService {
  async createRelationship(userId: string, input: CreateRelationshipInput): Promise<Relationship> {
    return relationshipRepository.create(userId, input);
  }

  async listRelationships(
    userId: string,
    query: ListRelationshipsQuery,
  ): Promise<{ relationships: Relationship[]; meta: PaginationMeta }> {
    const filter = query.interactionType ? { interactionType: query.interactionType } : {};
    const pagination = { page: query.page, limit: query.limit };

    const [relationships, total] = await Promise.all([
      relationshipRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      relationshipRepository.count(userId, filter),
    ]);

    return { relationships, meta: buildPaginationMeta(total, pagination) };
  }

  async listDueFollowUps(
    userId: string,
    query: DueFollowUpsQuery,
  ): Promise<{ relationships: Relationship[]; meta: PaginationMeta }> {
    const now = new Date();
    const pagination = { page: query.page, limit: query.limit };

    const [relationships, total] = await Promise.all([
      relationshipRepository.findDueFollowUps(userId, now, toSkip(pagination), pagination.limit),
      relationshipRepository.countDueFollowUps(userId, now),
    ]);

    return { relationships, meta: buildPaginationMeta(total, pagination) };
  }

  async getRelationshipById(userId: string, id: string): Promise<Relationship> {
    const relationship = await relationshipRepository.findById(userId, id);
    if (!relationship) throw new NotFoundError(`Relationship ${id} not found`);
    return relationship;
  }

  async updateRelationship(
    userId: string,
    id: string,
    input: UpdateRelationshipInput,
  ): Promise<Relationship> {
    await this.getRelationshipById(userId, id);
    return relationshipRepository.update(userId, id, input);
  }

  async deleteRelationship(userId: string, id: string): Promise<void> {
    await this.getRelationshipById(userId, id);
    await relationshipRepository.delete(userId, id);
  }

  /**
   * One row per distinct person (case-insensitive), carrying their most recent
   * interaction so the form can show "Last: paired on the auth bug, 12 days ago"
   * the moment you pick an existing name instead of retyping it fresh.
   */
  async searchPeople(userId: string, query: string | undefined, limit: number): Promise<PersonSummary[]> {
    const rows = await relationshipRepository.findRecentForPeopleSearch(userId, query, 500);
    const seen = new Map<string, PersonSummary>();

    for (const row of rows) {
      const key = row.personName.toLowerCase();
      if (seen.has(key)) continue;
      seen.set(key, {
        personName: row.personName,
        lastInteractionType: row.interactionType,
        lastInteractionAt: row.createdAt,
        lastContext: row.context,
      });
    }

    return Array.from(seen.values()).slice(0, limit);
  }
}

export const relationshipService = new RelationshipService();
