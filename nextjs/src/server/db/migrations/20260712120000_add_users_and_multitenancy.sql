-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "workosUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_workosUserId_key" ON "users"("workosUserId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Every owned record gets a userId column. Left NULLABLE at the database
-- level (not NOT NULL) so this migration never fails against rows that
-- predate multi-tenancy — the application layer always supplies userId on
-- every insert going forward, which is the enforcement that actually matters.
-- Any pre-existing rows will simply be invisible under the new per-user
-- filtering until manually backfilled with a real user's id.
ALTER TABLE "tickets" ADD COLUMN "userId" TEXT;
ALTER TABLE "tasks" ADD COLUMN "userId" TEXT;
ALTER TABLE "learnings" ADD COLUMN "userId" TEXT;
ALTER TABLE "relationships" ADD COLUMN "userId" TEXT;
ALTER TABLE "tags" ADD COLUMN "userId" TEXT;
ALTER TABLE "faqs" ADD COLUMN "userId" TEXT;
ALTER TABLE "ticket_activities" ADD COLUMN "userId" TEXT;

CREATE INDEX "tickets_userId_idx" ON "tickets"("userId");
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");
CREATE INDEX "learnings_userId_idx" ON "learnings"("userId");
CREATE INDEX "relationships_userId_idx" ON "relationships"("userId");
CREATE INDEX "tags_userId_idx" ON "tags"("userId");
CREATE INDEX "faqs_userId_idx" ON "faqs"("userId");
CREATE INDEX "ticket_activities_userId_idx" ON "ticket_activities"("userId");

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "learnings" ADD CONSTRAINT "learnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tags" ADD CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tags used to be a single global vocabulary (unique by name alone). Under
-- multi-tenancy each user needs their own namespace, so the same word (e.g.
-- "kubernetes") can exist once per user instead of being shared/contended.
DROP INDEX "tags_name_key";
CREATE UNIQUE INDEX "tags_userId_name_key" ON "tags"("userId", "name");
