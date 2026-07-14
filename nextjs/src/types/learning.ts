import type { Tag } from './common';

export interface Learning {
  id: string;
  title: string;
  domain: string;
  source: string | null;
  notes: string | null;
  confidence: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningInput {
  title: string;
  domain: string;
  source?: string;
  notes?: string;
  confidence: number;
  tags: string[];
}

export type UpdateLearningInput = Partial<CreateLearningInput>;

export interface LearningListQuery {
  page?: number;
  limit?: number;
  tag?: string;
  domain?: string;
}

export interface LowConfidenceQuery {
  page?: number;
  limit?: number;
  threshold?: number;
}
