/*
  Warnings:

  - You are about to drop the column `userId` on the `ActivityAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `DateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasOnboarded` on the `User` table. All the data in the column will be lost.
  - Added the required column `teamMemberId` to the `ActivityAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "attendanceStatus" TEXT NOT NULL,
    "attendedAt" DATETIME,
    CONSTRAINT "ActivityAttendance_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ActivityAttendance_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActivityAttendance" ("activityId", "attendanceStatus", "attendedAt", "id") SELECT "activityId", "attendanceStatus", "attendedAt", "id" FROM "ActivityAttendance";
DROP TABLE "ActivityAttendance";
ALTER TABLE "new_ActivityAttendance" RENAME TO "ActivityAttendance";
CREATE INDEX "ActivityAttendance_activityId_idx" ON "ActivityAttendance"("activityId");
CREATE INDEX "ActivityAttendance_teamMemberId_idx" ON "ActivityAttendance"("teamMemberId");
CREATE UNIQUE INDEX "ActivityAttendance_activityId_teamMemberId_key" ON "ActivityAttendance"("activityId", "teamMemberId");
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
