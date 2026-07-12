import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { skillService } from './skill.service';
import type { BlindSpotsQuery } from './skill.validation';

export const getSkillGrowth = asyncHandler(async (req, res) => {
  const skills = await skillService.getSkillGrowth(req.user!.id);
  sendSuccess(res, skills);
});

export const getBlindSpots = asyncHandler(async (req, res) => {
  const { days, limit } = req.query as unknown as BlindSpotsQuery;
  const skills = await skillService.getBlindSpots(req.user!.id, days, limit);
  sendSuccess(res, skills);
});
