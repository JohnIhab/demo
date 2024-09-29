/*
  Warnings:

  - The `isFree` column on the `Lecture` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "isFree",
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false;
