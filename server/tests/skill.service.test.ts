import { skillRepository } from '../src/modules/skills/skill.repository';
import { skillService } from '../src/modules/skills/skill.service';

jest.mock('../src/modules/skills/skill.repository', () => ({
  skillRepository: { findAllTagActivity: jest.fn() },
}));

const mockedFindAllTagActivity = skillRepository.findAllTagActivity as jest.Mock;

describe('skillService.getSkillGrowth', () => {
  it('ranks tags by total reps and derives lastTouchedAt from the most recent date', async () => {
    mockedFindAllTagActivity.mockResolvedValue([
      {
        name: 'node',
        ticketDates: [new Date('2026-01-01'), new Date('2026-02-01')],
        learningDates: [new Date('2026-03-01')],
      },
      {
        name: 'kubernetes',
        ticketDates: [],
        learningDates: [new Date('2026-01-15')],
      },
    ]);

    const result = await skillService.getSkillGrowth();

    expect(result[0]).toMatchObject({ tag: 'node', totalReps: 3 });
    expect(result[0]?.lastTouchedAt).toEqual(new Date('2026-03-01'));
    expect(result[1]).toMatchObject({ tag: 'kubernetes', totalReps: 1 });
  });
});

describe('skillService.getBlindSpots', () => {
  it('surfaces tags never touched or untouched within the window, oldest first', async () => {
    const now = Date.now();
    mockedFindAllTagActivity.mockResolvedValue([
      { name: 'recently-touched', ticketDates: [new Date(now - 1 * 24 * 60 * 60 * 1000)], learningDates: [] },
      { name: 'stale', ticketDates: [new Date(now - 90 * 24 * 60 * 60 * 1000)], learningDates: [] },
      { name: 'never-touched', ticketDates: [], learningDates: [] },
    ]);

    const blindSpots = await skillService.getBlindSpots(30, 10);

    expect(blindSpots.map((entry) => entry.tag)).toEqual(['never-touched', 'stale']);
  });
});
