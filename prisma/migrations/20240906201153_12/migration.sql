-- CreateTable
CREATE TABLE "_LectureTerms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LectureTerms_AB_unique" ON "_LectureTerms"("A", "B");

-- CreateIndex
CREATE INDEX "_LectureTerms_B_index" ON "_LectureTerms"("B");

-- AddForeignKey
ALTER TABLE "_LectureTerms" ADD CONSTRAINT "_LectureTerms_A_fkey" FOREIGN KEY ("A") REFERENCES "Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LectureTerms" ADD CONSTRAINT "_LectureTerms_B_fkey" FOREIGN KEY ("B") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;
