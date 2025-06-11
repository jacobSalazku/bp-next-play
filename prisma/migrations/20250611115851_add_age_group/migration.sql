-- DropForeignKey
ALTER TABLE "OpponentStatline" DROP CONSTRAINT "OpponentStatline_activityId_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ageGroup" TEXT;

-- AddForeignKey
ALTER TABLE "OpponentStatline" ADD CONSTRAINT "OpponentStatline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
