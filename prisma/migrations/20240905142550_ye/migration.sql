/*
  Warnings:

  - You are about to drop the `_ContentToCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContentToCourse" DROP CONSTRAINT "_ContentToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentToCourse" DROP CONSTRAINT "_ContentToCourse_B_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ContentToCourse";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
