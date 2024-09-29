/*
  Warnings:

  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "description",
DROP COLUMN "level",
ADD COLUMN     "courseFor" TEXT;

-- CreateTable
CREATE TABLE "_ContentToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContentToCourse_AB_unique" ON "_ContentToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentToCourse_B_index" ON "_ContentToCourse"("B");

-- AddForeignKey
ALTER TABLE "_ContentToCourse" ADD CONSTRAINT "_ContentToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentToCourse" ADD CONSTRAINT "_ContentToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
