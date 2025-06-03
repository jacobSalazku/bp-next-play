/*
  Warnings:

  - You are about to drop the column `gameplan` on the `Activity` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Play" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "canvas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GamePlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT,
    "name" TEXT NOT NULL,
    "opponent" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GamePlan_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticePreparation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT,
    "name" TEXT NOT NULL,
    "focus" TEXT,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PracticePreparation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PracticePlays" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PracticePlays_A_fkey" FOREIGN KEY ("A") REFERENCES "Play" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PracticePlays_B_fkey" FOREIGN KEY ("B") REFERENCES "PracticePreparation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GamePlanPlays" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GamePlanPlays_A_fkey" FOREIGN KEY ("A") REFERENCES "GamePlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GamePlanPlays_B_fkey" FOREIGN KEY ("B") REFERENCES "Play" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" REAL,
    "practiceType" TEXT,
    "notes" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "teamId" TEXT NOT NULL,
    CONSTRAINT "Activity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("createdAt", "date", "duration", "id", "notes", "practiceType", "teamId", "time", "title", "type", "updatedAt") SELECT "createdAt", "date", "duration", "id", "notes", "practiceType", "teamId", "time", "title", "type", "updatedAt" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "GamePlan_activityId_key" ON "GamePlan"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticePreparation_activityId_key" ON "PracticePreparation"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "_PracticePlays_AB_unique" ON "_PracticePlays"("A", "B");

-- CreateIndex
CREATE INDEX "_PracticePlays_B_index" ON "_PracticePlays"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GamePlanPlays_AB_unique" ON "_GamePlanPlays"("A", "B");

-- CreateIndex
CREATE INDEX "_GamePlanPlays_B_index" ON "_GamePlanPlays"("B");
