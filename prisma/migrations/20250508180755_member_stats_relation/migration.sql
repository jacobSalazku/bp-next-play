/*
  Warnings:

  - Added the required column `teamMemberId` to the `Statline` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Statline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
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
INSERT INTO "new_Statline" ("activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "playerId", "rebounds", "steals", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt") SELECT "activityId", "assists", "blocks", "createdAt", "fieldGoalsMade", "fieldGoalsMissed", "freeThrows", "id", "missedFreeThrows", "playerId", "rebounds", "steals", "threePointersMade", "threePointersMissed", "turnovers", "updatedAt" FROM "Statline";
DROP TABLE "Statline";
ALTER TABLE "new_Statline" RENAME TO "Statline";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
