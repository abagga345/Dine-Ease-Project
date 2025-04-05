/*
  Warnings:

  - You are about to drop the `Analytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Analytics";

-- CreateTable
CREATE TABLE "MonthlySales" (
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalSales" INTEGER NOT NULL,

    CONSTRAINT "MonthlySales_pkey" PRIMARY KEY ("year","month")
);
