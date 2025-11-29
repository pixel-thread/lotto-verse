/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'OK', 'ERROR');

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Device_id_seq";

-- CreateTable
CREATE TABLE "PushTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "pushToken" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushTicket_ticketId_key" ON "PushTicket"("ticketId");

-- CreateIndex
CREATE INDEX "PushTicket_status_idx" ON "PushTicket"("status");

-- CreateIndex
CREATE INDEX "PushTicket_createdAt_idx" ON "PushTicket"("createdAt");
