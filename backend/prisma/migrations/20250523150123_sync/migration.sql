-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "availabilty" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
