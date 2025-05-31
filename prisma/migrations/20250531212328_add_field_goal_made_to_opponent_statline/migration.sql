/*
  Warnings:

  - You are about to drop the column `twoPointersMade` on the `OpponentStatline` table. All the data in the column will be lost.
  - Added the required column `fieldGoalMade` to the `OpponentStatline` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OpponentStatline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "fieldGoalMade" INTEGER NOT NULL,
    "threePointersMade" INTEGER NOT NULL,
    "freeThrowsMade" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpponentStatline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OpponentStatline" ("activityId", "createdAt", "freeThrowsMade", "id", "name", "threePointersMade", "updatedAt") SELECT "activityId", "createdAt", "freeThrowsMade", "id", "name", "threePointersMade", "updatedAt" FROM "OpponentStatline";
DROP TABLE "OpponentStatline";
ALTER TABLE "new_OpponentStatline" RENAME TO "OpponentStatline";
CREATE UNIQUE INDEX "OpponentStatline_activityId_key" ON "OpponentStatline"("activityId");
CREATE UNIQUE INDEX "opponent_activity_unique" ON "OpponentStatline"("activityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
