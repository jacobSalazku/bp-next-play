-- CreateTable
CREATE TABLE "OpponentStatline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "twoPointersMade" INTEGER NOT NULL,
    "threePointersMade" INTEGER NOT NULL,
    "freeThrowsMade" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OpponentStatline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OpponentStatline_activityId_key" ON "OpponentStatline"("activityId");
