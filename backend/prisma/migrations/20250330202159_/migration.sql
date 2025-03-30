/*
  Warnings:

  - The values [Pending,Completed,Cancelled] on the enum `status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `username` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `storeSecret` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Admins` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roletype" AS ENUM ('Admin', 'User');

-- AlterEnum
BEGIN;
CREATE TYPE "status_new" AS ENUM ('Unconfirmed', 'Rejected', 'Processing', 'Delivered', 'Dispatched');
ALTER TABLE "Orders" ALTER COLUMN "status" TYPE "status_new" USING ("status"::text::"status_new");
ALTER TYPE "status" RENAME TO "status_old";
ALTER TYPE "status_new" RENAME TO "status";
DROP TYPE "status_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_username_fkey";

-- DropForeignKey
ALTER TABLE "Admins" DROP CONSTRAINT "Admins_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_username_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_username_fkey";

-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "details",
DROP COLUMN "discount",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "timestamp",
DROP COLUMN "username",
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "storeSecret";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "role" "roletype" NOT NULL DEFAULT 'User',
ADD COLUMN     "storeId" TEXT;

-- DropTable
DROP TABLE "Admins";

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
