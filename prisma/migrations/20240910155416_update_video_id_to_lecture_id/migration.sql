/*
  Warnings:

  - You are about to drop the column `videoId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `_CartItemToLecture` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cartId,lectureId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lectureId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CartItemToLecture" DROP CONSTRAINT "_CartItemToLecture_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToLecture" DROP CONSTRAINT "_CartItemToLecture_B_fkey";

-- DropIndex
DROP INDEX "CartItem_cartId_videoId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "videoId",
ADD COLUMN     "lectureId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CartItemToLecture";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_lectureId_key" ON "CartItem"("cartId", "lectureId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
