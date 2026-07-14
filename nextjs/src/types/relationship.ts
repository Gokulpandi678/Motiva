export const INTERACTION_TYPES = ['HELPED', 'PAIRED_WITH', 'LEARNED_FROM'] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export interface Relationship {
  id: string;
  personName: string;
  interactionType: InteractionType;
  context: string | null;
  notes: string | null;
  followUpDate: string | null;
  followUpDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelationshipInput {
  personName: string;
  interactionType: InteractionType;
  context?: string;
  notes?: string;
  followUpDate?: string;
}

export type UpdateRelationshipInput = Partial<CreateRelationshipInput> & {
  followUpDone?: boolean;
};

export interface RelationshipListQuery {
  page?: number;
  limit?: number;
  interactionType?: InteractionType;
}

export interface DueFollowUpsQuery {
  page?: number;
  limit?: number;
}
