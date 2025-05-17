/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `OtpStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtpStatus_email_key" ON "OtpStatus"("email");
