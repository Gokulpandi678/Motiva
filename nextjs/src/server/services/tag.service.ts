import type { Tag } from '../common/types/models';
import { BadRequestError, ConflictError, NotFoundError } from '../common/errors';
import { normalizeTagNames } from '../common/resolveTags';
import { tagRepository, type TagWithUsage } from '../repositories/tag.repository';

class TagService {
  async search(userId: string, query: string | undefined, limit: number): Promise<TagWithUsage[]> {
    return tagRepository.search(userId, query, limit);
  }

  async renameTag(userId: string, id: string, name: string): Promise<Tag> {
    const tag = await tagRepository.findById(userId, id);
    if (!tag) throw new NotFoundError(`Tag ${id} not found`);

    const [normalized] = normalizeTagNames([name]);
    if (!normalized) throw new BadRequestError('Tag name cannot be empty');

    if (normalized === tag.name) return tag;

    const existing = await tagRepository.findByName(userId, normalized);
    if (existing) {
      throw new ConflictError(
        `A tag named "${normalized}" already exists — merge into it instead of renaming`,
        { existingTagId: existing.id },
      );
    }

    return tagRepository.rename(userId, id, normalized);
  }

  async mergeTag(userId: string, sourceId: string, targetTagId: string): Promise<Tag> {
    if (sourceId === targetTagId) {
      throw new BadRequestError('Cannot merge a tag into itself');
    }

    const [source, target] = await Promise.all([
      tagRepository.findById(userId, sourceId),
      tagRepository.findById(userId, targetTagId),
    ]);

    if (!source) throw new NotFoundError(`Tag ${sourceId} not found`);
    if (!target) throw new NotFoundError(`Tag ${targetTagId} not found`);

    return tagRepository.merge(userId, sourceId, targetTagId);
  }

  async deleteTag(userId: string, id: string): Promise<void> {
    const tag = await tagRepository.findById(userId, id);
    if (!tag) throw new NotFoundError(`Tag ${id} not found`);
    await tagRepository.delete(userId, id);
  }
}

export const tagService = new TagService();
