/*
  Warnings:

  - You are about to drop the column `courseId` on the `CourseContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseContent" DROP CONSTRAINT "CourseContent_courseId_fkey";

-- AlterTable
ALTER TABLE "CourseContent" DROP COLUMN "courseId";
