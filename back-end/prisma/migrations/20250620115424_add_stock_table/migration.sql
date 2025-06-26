-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_articleId_zoneId_key" ON "Stock"("articleId", "zoneId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "StorageZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
