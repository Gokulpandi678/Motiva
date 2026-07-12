export interface SkillGrowthEntry {
  tag: string;
  ticketCount: number;
  learningCount: number;
  totalReps: number;
  lastTouchedAt: string | null;
}

export interface BlindSpotsQuery {
  days?: number;
  limit?: number;
}
