/*
  Warnings:

  - You are about to drop the column `attendedAt` on the `ActivityAttendance` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ActivityAttendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `assists` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blocks` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fieldGoalsMade` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fieldGoalsMissed` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `freeThrows` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `missedFreeThrows` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rebounds` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `steals` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `threePointersMade` on table `Statline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `turnovers` on table `Statline` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "attendanceStatus" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActivityAttendance_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityAttendance_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActivityAttendance" ("activityId", "attendanceStatus", "id", "reason", "teamMemberId") SELECT "activityId", "attendanceStatus", "id", "reason", "teamMemberId" FROM "ActivityAttendance";
DROP TABLE "ActivityAttendance";
ALTER TABLE "new_ActivityAttendance" RENAME TO "ActivityAttendance";
CREATE INDEX "ActivityAttendance_activityId_idx" ON "ActivityAttendance"("activityId");
CREATE INDEX "ActivityAttendance_teamMemberId_idx" ON "ActivityAttendance"("teamMemberId");
CREATE UNIQUE INDEX "ActivityAttendance_activityId_teamMemberId_key" ON "ActivityAttendance"("activityId", "teamMemberId");
CREATE TABLE "new_Statline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamMemberId" TEXT NOT NULL,
    "fieldGoalsMade" INTEGER NOT NULL,
    "fieldGoalsMissed" INTEGER NOT NULL,
    "threePointersMade" INTEGER NOT NULL,
    "threePointersMissed" INTEGER NOT NULL,
    "freeThrows" INTEGER NOT NULL,
    "missedFreeThrows" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "steals" INTEGER NOT NULL,
    "turnovers" INTEGER NOT NULL,
    "rebounds" INTEGER NOT NULL,
    "blocks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "activityId" TEXT NOT NULL,
    CONSTRAINT "Statline_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Statline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Statline" ("activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "rebounds", "steals", "teamMemberId", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt") SELECT "activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "rebounds", "steals", "teamMemberId", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt" FROM "Statline";
DROP TABLE "Statline";
ALTER TABLE "new_Statline" RENAME TO "Statline";
CREATE UNIQUE INDEX "Statline_teamMemberId_activityId_key" ON "Statline"("teamMemberId", "activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
