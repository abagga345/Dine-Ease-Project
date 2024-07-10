-- DropForeignKey
ALTER TABLE "Admins" DROP CONSTRAINT "Admins_storeId_fkey";

-- AlterTable
ALTER TABLE "Admins" ALTER COLUMN "storeId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;
