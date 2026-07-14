import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { skillService } from '@/server/services/skill.service';

export const runtime = 'nodejs';

export const GET = withAuth(async (_request, { user }) => {
  const skills = await skillService.getSkillGrowth(user.id);
  return apiSuccess(skills);
});
