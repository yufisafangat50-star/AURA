-- AlterTable
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "is_critic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "dataset_references" ADD COLUMN IF NOT EXISTS "coverage_period" TEXT;
ALTER TABLE "dataset_references" ADD COLUMN IF NOT EXISTS "license" TEXT;
