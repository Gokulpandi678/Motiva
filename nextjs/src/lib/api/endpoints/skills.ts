import { httpClient } from '../client';
import type { ApiSuccess } from '@/types/common';
import type { BlindSpotsQuery, SkillGrowthEntry } from '@/types/skill';

export const skillsApi = {
  async getGrowth(): Promise<SkillGrowthEntry[]> {
    const response = await httpClient.get<ApiSuccess<SkillGrowthEntry[]>>('/skills');
    return response.data.data;
  },

  async getBlindSpots(query: BlindSpotsQuery): Promise<SkillGrowthEntry[]> {
    const response = await httpClient.get<ApiSuccess<SkillGrowthEntry[]>>('/skills/blind-spots', {
      params: query,
    });
    return response.data.data;
  },
};
