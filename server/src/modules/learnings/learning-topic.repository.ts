import { query } from '../../config/db';

export interface TopicLearningEntry {
  id: string;
  title: string;
  domain: string;
  confidence: number;
  notes: string | null;
  source: string | null;
  createdAt: Date;
}

export interface TopicActivity {
  tag: string;
  entries: TopicLearningEntry[];
}

interface TopicRow extends TopicLearningEntry {
  tag: string;
}

const BASE_QUERY = `
  SELECT tag."name" AS tag, l."id", l."title", l."domain", l."confidence", l."notes", l."source", l."createdAt"
  FROM "tags" tag
  JOIN "_LearningToTag" lt ON lt."B" = tag."id"
  JOIN "learnings" l ON l."id" = lt."A"
  WHERE l."userId" = $1
`;

function groupByTag(rows: TopicRow[]): TopicActivity[] {
  const byTag = new Map<string, TopicLearningEntry[]>();
  for (const { tag, ...entry } of rows) {
    const list = byTag.get(tag) ?? [];
    list.push(entry);
    byTag.set(tag, list);
  }
  return Array.from(byTag.entries()).map(([tag, entries]) => ({ tag, entries }));
}

class LearningTopicRepository {
  /** All tags that have at least one learning attached, each with its full log history. */
  async findAllTopicActivity(userId: string): Promise<TopicActivity[]> {
    const rows = await query<TopicRow>(`${BASE_QUERY} ORDER BY tag."name" ASC, l."createdAt" DESC`, [userId]);
    return groupByTag(rows);
  }

  async findTopicByTag(userId: string, tagName: string): Promise<TopicActivity | null> {
    const rows = await query<TopicRow>(
      `${BASE_QUERY} AND tag."name" = $2 ORDER BY l."createdAt" DESC`,
      [userId, tagName.toLowerCase()],
    );
    if (rows.length === 0) return null;
    return groupByTag(rows)[0]!;
  }
}

export const learningTopicRepository = new LearningTopicRepository();
