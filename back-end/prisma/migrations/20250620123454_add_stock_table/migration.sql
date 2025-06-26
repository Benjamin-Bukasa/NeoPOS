/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_name_key" ON "Article"("name");
