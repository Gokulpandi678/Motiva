export interface TopicSummary {
  tag: string;
  domains: string[];
  entryCount: number;
  lastLoggedAt: string;
  latestConfidence: number;
}

export interface TopicLearningEntry {
  id: string;
  title: string;
  domain: string;
  confidence: number;
  notes: string | null;
  source: string | null;
  createdAt: string;
}

export interface TopicTimeline {
  tag: string;
  entries: TopicLearningEntry[];
}

export interface TopicsQuery {
  domain?: string;
}
