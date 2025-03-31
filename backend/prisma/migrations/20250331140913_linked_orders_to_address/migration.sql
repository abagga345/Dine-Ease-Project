-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "addressId" INTEGER NOT NULL DEFAULT 5;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
