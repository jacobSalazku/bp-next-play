/*
  Warnings:

  - Made the column `activityId` on table `GamePlan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `teamId` to the `PracticePreparation` table without a default value. This is not possible if the table is not empty.
  - Made the column `activityId` on table `PracticePreparation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GamePlan" DROP CONSTRAINT "GamePlan_activityId_fkey";

-- DropForeignKey
ALTER TABLE "PracticePreparation" DROP CONSTRAINT "PracticePreparation_activityId_fkey";

-- AlterTable
ALTER TABLE "GamePlan" ALTER COLUMN "activityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PracticePreparation" ADD COLUMN     "teamId" TEXT NOT NULL,
ALTER COLUMN "activityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "GamePlan" ADD CONSTRAINT "GamePlan_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticePreparation" ADD CONSTRAINT "PracticePreparation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticePreparation" ADD CONSTRAINT "PracticePreparation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
