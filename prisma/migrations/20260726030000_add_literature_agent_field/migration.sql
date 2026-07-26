-- AlterTable
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "is_literature_agent" BOOLEAN NOT NULL DEFAULT false;
