/*
  Warnings:

  - You are about to drop the column `availabilty` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "availabilty",
ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true;
