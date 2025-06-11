-- DropForeignKey
ALTER TABLE "Statline" DROP CONSTRAINT "Statline_activityId_fkey";

-- AddForeignKey
ALTER TABLE "Statline" ADD CONSTRAINT "Statline_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
