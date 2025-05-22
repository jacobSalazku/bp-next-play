/*
  Warnings:

  - You are about to drop the column `DateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasOnboarded` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Statline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamMemberId" TEXT NOT NULL,
    "fieldGoalsMade" INTEGER,
    "fieldGoalsMissed" INTEGER,
    "threePointersMade" INTEGER,
    "threePointersMissed" INTEGER NOT NULL,
    "freeThrows" INTEGER,
    "missedFreeThrows" INTEGER,
    "assists" INTEGER,
    "steals" INTEGER,
    "turnovers" INTEGER,
    "rebounds" INTEGER,
    "blocks" INTEGER,
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
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "dateOfBirth" DATETIME,
    "phone" TEXT,
    "height" REAL,
    "weight" REAL,
    "dominantHand" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasOnBoarded" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("createdAt", "dominantHand", "email", "emailVerified", "height", "id", "image", "name", "phone", "updatedAt", "weight") SELECT "createdAt", "dominantHand", "email", "emailVerified", "height", "id", "image", "name", "phone", "updatedAt", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
