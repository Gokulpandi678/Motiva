import { randomUUID } from 'node:crypto';
import { queryOne } from '../../config/db';
import type { User } from '../../common/types/models';

export interface WorkosProfile {
  workosUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  profilePictureUrl: string | null;
}

class UserRepository {
  /** Creates the local user row on first login, or refreshes it from the latest WorkOS profile on every later one. */
  async upsertFromWorkosProfile(profile: WorkosProfile): Promise<User> {
    const user = await queryOne<User>(
      `INSERT INTO "users"
         ("id", "workosUserId", "email", "firstName", "lastName", "emailVerified", "profilePictureUrl", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT ("workosUserId") DO UPDATE SET
         "email" = EXCLUDED."email",
         "firstName" = EXCLUDED."firstName",
         "lastName" = EXCLUDED."lastName",
         "emailVerified" = EXCLUDED."emailVerified",
         "profilePictureUrl" = EXCLUDED."profilePictureUrl",
         "updatedAt" = NOW()
       RETURNING *`,
      [
        randomUUID(),
        profile.workosUserId,
        profile.email,
        profile.firstName,
        profile.lastName,
        profile.emailVerified,
        profile.profilePictureUrl,
      ],
    );
    return user!;
  }

  async findByWorkosUserId(workosUserId: string): Promise<User | null> {
    return queryOne<User>(`SELECT * FROM "users" WHERE "workosUserId" = $1`, [workosUserId]);
  }

  async findById(id: string): Promise<User | null> {
    return queryOne<User>(`SELECT * FROM "users" WHERE "id" = $1`, [id]);
  }
}

export const userRepository = new UserRepository();
