/*
  Warnings:

  - The primary key for the `MonthlySales` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `day` to the `MonthlySales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlySales" DROP CONSTRAINT "MonthlySales_pkey",
ADD COLUMN     "day" INTEGER NOT NULL,
ADD CONSTRAINT "MonthlySales_pkey" PRIMARY KEY ("year", "month", "day");
