/*
  Warnings:

  - You are about to drop the column `academicYear` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Video` table. All the data in the column will be lost.
  - Added the required column `lectureId` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Videoss" DROP CONSTRAINT "Videoss_lectureId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "academicYear",
DROP COLUMN "imageUrl",
DROP COLUMN "price",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "lectureId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
