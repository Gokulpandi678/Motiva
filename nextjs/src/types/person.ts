import type { InteractionType } from './relationship';

export interface PersonSummary {
  personName: string;
  lastInteractionType: InteractionType;
  lastInteractionAt: string;
  lastContext: string | null;
}

export interface SearchPeopleQuery {
  q?: string;
  limit?: number;
}
