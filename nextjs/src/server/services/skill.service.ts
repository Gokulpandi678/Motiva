import { skillRepository } from '../repositories/skill.repository';
import type { SkillGrowthEntry } from '../repositories/skill.types';

class SkillService {
  /**
   * Derives per-skill activity purely from ticket tags + learning tags —
   * there is no manual "skill" entry anywhere in the system.
   */
  async getSkillGrowth(userId: string): Promise<SkillGrowthEntry[]> {
    const activity = await skillRepository.findAllTagActivity(userId);

    const entries = activity.map<SkillGrowthEntry>(({ name, ticketDates, learningDates }) => {
      const allDates = [...ticketDates, ...learningDates];
      const lastTouchedAt =
        allDates.length > 0
          ? new Date(Math.max(...allDates.map((d) => d.getTime())))
          : null;

      return {
        tag: name,
        ticketCount: ticketDates.length,
        learningCount: learningDates.length,
        totalReps: ticketDates.length + learningDates.length,
        lastTouchedAt,
      };
    });

    return entries.sort((a, b) => b.totalReps - a.totalReps);
  }

  /**
   * Skills you're least touching: never touched, or not touched within
   * `days`. Surfaces the blind spots the ticket/learning logs can't show
   * on their own.
   */
  async getBlindSpots(userId: string, days: number, limit: number): Promise<SkillGrowthEntry[]> {
    const growth = await this.getSkillGrowth(userId);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    return growth
      .filter((entry) => !entry.lastTouchedAt || entry.lastTouchedAt.getTime() < cutoff)
      .sort((a, b) => {
        const aTime = a.lastTouchedAt?.getTime() ?? -Infinity;
        const bTime = b.lastTouchedAt?.getTime() ?? -Infinity;
        return aTime - bTime;
      })
      .slice(0, limit);
  }
}

export const skillService = new SkillService();
