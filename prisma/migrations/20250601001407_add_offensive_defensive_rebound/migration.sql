/*
  Warnings:

  - You are about to drop the column `fieldGoalMade` on the `OpponentStatline` table. All the data in the column will be lost.
  - You are about to drop the column `rebounds` on the `Statline` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OpponentStatline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "fieldGoalsMade" INTEGER NOT NULL DEFAULT 0,
    "threePointersMade" INTEGER NOT NULL DEFAULT 0,
    "freeThrowsMade" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpponentStatline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OpponentStatline" ("activityId", "createdAt", "freeThrowsMade", "id", "name", "threePointersMade", "updatedAt") SELECT "activityId", "createdAt", "freeThrowsMade", "id", "name", "threePointersMade", "updatedAt" FROM "OpponentStatline";
DROP TABLE "OpponentStatline";
ALTER TABLE "new_OpponentStatline" RENAME TO "OpponentStatline";
CREATE UNIQUE INDEX "OpponentStatline_activityId_key" ON "OpponentStatline"("activityId");
CREATE UNIQUE INDEX "opponent_activity_unique" ON "OpponentStatline"("activityId");
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
    "offensiveRebounds" INTEGER NOT NULL DEFAULT 0,
    "defensiveRebounds" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "activityId" TEXT NOT NULL,
    CONSTRAINT "Statline_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Statline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Statline" ("activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "steals", "teamMemberId", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt") SELECT "activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "steals", "teamMemberId", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt" FROM "Statline";
DROP TABLE "Statline";
ALTER TABLE "new_Statline" RENAME TO "Statline";
CREATE UNIQUE INDEX "Statline_teamMemberId_activityId_key" ON "Statline"("teamMemberId", "activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
