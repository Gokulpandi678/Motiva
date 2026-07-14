import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api/endpoints/skills';
import type { BlindSpotsQuery } from '@/types/skill';

export function useSkillGrowth() {
  return useQuery({
    queryKey: ['skills', 'growth'],
    queryFn: () => skillsApi.getGrowth(),
  });
}

export function useBlindSpots(query: BlindSpotsQuery) {
  return useQuery({
    queryKey: ['skills', 'blind-spots', query],
    queryFn: () => skillsApi.getBlindSpots(query),
  });
}
