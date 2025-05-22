/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `playerId` on the `Statline` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "number" TEXT;
ALTER TABLE "TeamMember" ADD COLUMN "position" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "DateOfBirth" DATETIME;
ALTER TABLE "User" ADD COLUMN "dominantHand" TEXT;
ALTER TABLE "User" ADD COLUMN "height" REAL;
ALTER TABLE "User" ADD COLUMN "phone" TEXT;
ALTER TABLE "User" ADD COLUMN "weight" REAL;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
