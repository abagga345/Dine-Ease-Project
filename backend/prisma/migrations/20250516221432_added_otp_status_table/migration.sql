-- CreateTable
CREATE TABLE "OtpStatus" (
    "email" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "OtpStatus_pkey" PRIMARY KEY ("id")
);
