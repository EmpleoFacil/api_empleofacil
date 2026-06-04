-- AlterTable
ALTER TABLE "ApplicationNote"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedByUserId" TEXT;

-- CreateIndex
CREATE INDEX "ApplicationNote_updatedByUserId_idx" ON "ApplicationNote"("updatedByUserId");

-- AddForeignKey
ALTER TABLE "ApplicationNote"
ADD CONSTRAINT "ApplicationNote_updatedByUserId_fkey"
FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
