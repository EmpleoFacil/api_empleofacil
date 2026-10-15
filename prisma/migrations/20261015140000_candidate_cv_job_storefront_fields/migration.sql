ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3);
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "municipality" TEXT;
ALTER TABLE "CandidateProfile" ADD COLUMN IF NOT EXISTS "zone" TEXT;

ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "department" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "municipality" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "zone" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "workSchedule" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "additionalInfo" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "showContactInfo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;

ALTER TABLE "CandidateDocument" ADD COLUMN IF NOT EXISTS "isPrimary" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "CandidateDocument_candidateId_isPrimary_idx"
  ON "CandidateDocument"("candidateId", "isPrimary");
CREATE INDEX IF NOT EXISTS "Application_candidateId_appliedAt_idx"
  ON "Application"("candidateId", "appliedAt");
CREATE INDEX IF NOT EXISTS "Job_status_categoryId_createdAt_idx"
  ON "Job"("status", "categoryId", "createdAt");
