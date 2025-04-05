/*
  Warnings:

  - You are about to drop the `MonthlySales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MonthlySales";

-- CreateTable
CREATE TABLE "Analytics" (
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalSales" INTEGER NOT NULL,
    "avgReviews" INTEGER NOT NULL,
    "visibleCount" INTEGER NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("year","month")
);
