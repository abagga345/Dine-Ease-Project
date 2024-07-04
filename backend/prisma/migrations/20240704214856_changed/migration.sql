-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_storeId_fkey";

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "storeId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("storeId") ON DELETE RESTRICT ON UPDATE CASCADE;
