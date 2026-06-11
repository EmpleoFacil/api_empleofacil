ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "secondaryPhone" TEXT;

CREATE INDEX IF NOT EXISTS "User_secondaryPhone_idx"
ON "User"("secondaryPhone");
