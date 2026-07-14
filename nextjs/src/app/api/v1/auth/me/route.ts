import { withAuth } from '@/server/http/route';
import { apiSuccess } from '@/server/http/response';
import { UnauthorizedError } from '@/server/common/errors';
import { userRepository } from '@/server/auth/user.repository';

export const runtime = 'nodejs';

export const GET = withAuth(async (_request, { user }) => {
  const fullUser = await userRepository.findById(user.id);
  if (!fullUser) throw new UnauthorizedError('User not found');
  return apiSuccess(fullUser);
});
