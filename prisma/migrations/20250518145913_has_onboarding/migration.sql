-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "DateOfBirth" DATETIME,
    "phone" TEXT,
    "height" REAL,
    "weight" REAL,
    "dominantHand" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("DateOfBirth", "createdAt", "dominantHand", "email", "emailVerified", "height", "id", "image", "name", "phone", "updatedAt", "weight") SELECT "DateOfBirth", "createdAt", "dominantHand", "email", "emailVerified", "height", "id", "image", "name", "phone", "updatedAt", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
