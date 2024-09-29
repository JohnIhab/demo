/*
  Warnings:

  - You are about to drop the column `courseId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the `PDF` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Videoss` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contentId` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_courseId_fkey";

-- DropForeignKey
ALTER TABLE "PDF" DROP CONSTRAINT "PDF_contentId_fkey";

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "courseId",
ADD COLUMN     "contentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "PDF";

-- DropTable
DROP TABLE "Videoss";

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "CourseContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
