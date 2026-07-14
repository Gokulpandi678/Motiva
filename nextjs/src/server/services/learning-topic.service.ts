import { NotFoundError } from '../common/errors';
import { normalizeTagNames } from '../common/resolveTags';
import { learningTopicRepository, type TopicLearningEntry } from '../repositories/learning-topic.repository';

export interface TopicSummary {
  tag: string;
  domains: string[];
  entryCount: number;
  lastLoggedAt: Date;
  latestConfidence: number;
}

export interface TopicTimeline {
  tag: string;
  entries: TopicLearningEntry[];
}

class LearningTopicService {
  /**
   * One row per topic (tag) that has ever had a learning logged against it —
   * regardless of domain — so "last touched" recency works the same whether
   * the topic is tech or a hobby. Entries are already sorted newest-first by
   * the repository, so entries[0] gives the latest log for free.
   */
  async listTopics(userId: string, domain?: string): Promise<TopicSummary[]> {
    const activity = await learningTopicRepository.findAllTopicActivity(userId);

    const summaries = activity
      .map((topic) => {
        const entries = domain
          ? topic.entries.filter((entry) => entry.domain.toLowerCase() === domain.toLowerCase())
          : topic.entries;

        if (entries.length === 0) return null;

        return {
          tag: topic.tag,
          domains: Array.from(new Set(entries.map((entry) => entry.domain))),
          entryCount: entries.length,
          lastLoggedAt: entries[0]!.createdAt,
          latestConfidence: entries[0]!.confidence,
        } satisfies TopicSummary;
      })
      .filter((summary): summary is TopicSummary => summary !== null);

    return summaries.sort((a, b) => a.lastLoggedAt.getTime() - b.lastLoggedAt.getTime());
  }

  async getTopicTimeline(userId: string, tag: string): Promise<TopicTimeline> {
    const normalized = normalizeTagNames([tag])[0];
    const topic = normalized ? await learningTopicRepository.findTopicByTag(userId, normalized) : null;

    if (!topic) throw new NotFoundError(`No learnings logged for topic "${tag}"`);

    return topic;
  }
}

export const learningTopicService = new LearningTopicService();
