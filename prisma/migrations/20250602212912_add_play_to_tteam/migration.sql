/*
  Warnings:

  - Added the required column `teamId` to the `Play` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Play" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "canvas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Play_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Play" ("canvas", "category", "createdAt", "description", "id", "name", "notes") SELECT "canvas", "category", "createdAt", "description", "id", "name", "notes" FROM "Play";
DROP TABLE "Play";
ALTER TABLE "new_Play" RENAME TO "Play";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
