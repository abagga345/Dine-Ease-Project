/*
  Warnings:

  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "city",
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'delhi';

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "city",
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'delhi';
