/*
  Warnings:

  - Added the required column `adminId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
