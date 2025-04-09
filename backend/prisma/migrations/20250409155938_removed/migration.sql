-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "state" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "paymentMethod" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "state" DROP DEFAULT;
