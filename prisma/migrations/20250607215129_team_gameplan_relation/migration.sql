/*
  Warnings:

  - Added the required column `teamId` to the `GamePlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlan" ADD COLUMN     "teamId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GamePlan" ADD CONSTRAINT "GamePlan_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
