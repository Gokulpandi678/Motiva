-- AlterTable
ALTER TABLE "learnings" ADD COLUMN     "domain" TEXT NOT NULL DEFAULT 'Technology';

-- CreateIndex
CREATE INDEX "learnings_domain_idx" ON "learnings"("domain");
