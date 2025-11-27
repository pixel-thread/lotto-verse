-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('IMPORTANT', 'ALL', 'DRAW', 'REWARD');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "UpdateChannel" AS ENUM ('PROD', 'UAT', 'DEV');

-- CreateEnum
CREATE TYPE "UpdateType" AS ENUM ('OTA', 'PTA');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "startRange" INTEGER NOT NULL,
    "isWinnerDecleared" BOOLEAN NOT NULL DEFAULT false,
    "declareAt" TIMESTAMP(3),
    "entryFee" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "endRange" INTEGER NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prize" (
    "id" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LuckyNumber" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "drawId" TEXT NOT NULL,
    "winnerId" TEXT,

    CONSTRAINT "LuckyNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "luckyNumberId" TEXT NOT NULL,
    "razorpayId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "drawId" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" TEXT,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "luckyNumberId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "purchaseId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isBackend" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUpdate" (
    "id" TEXT NOT NULL,
    "channel" "UpdateChannel" NOT NULL DEFAULT 'UAT',
    "type" "UpdateType" NOT NULL DEFAULT 'OTA',
    "runtimeVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "releaseName" TEXT NOT NULL DEFAULT 'Monthly Release',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "minAppVersion" TEXT DEFAULT '1.0.1',
    "rolloutPercent" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "releaseNotes" TEXT,
    "assetUrl" TEXT,
    "createdBy" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LuckyNumberToPurchase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LuckyNumberToPurchase_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Draw_id_idx" ON "Draw"("id");

-- CreateIndex
CREATE INDEX "Draw_month_idx" ON "Draw"("month");

-- CreateIndex
CREATE UNIQUE INDEX "Prize_drawId_key" ON "Prize"("drawId");

-- CreateIndex
CREATE INDEX "LuckyNumber_id_idx" ON "LuckyNumber"("id");

-- CreateIndex
CREATE INDEX "LuckyNumber_drawId_idx" ON "LuckyNumber"("drawId");

-- CreateIndex
CREATE UNIQUE INDEX "LuckyNumber_number_drawId_key" ON "LuckyNumber"("number", "drawId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_razorpayId_key" ON "Purchase"("razorpayId");

-- CreateIndex
CREATE INDEX "Purchase_userId_drawId_idx" ON "Purchase"("userId", "drawId");

-- CreateIndex
CREATE INDEX "Purchase_luckyNumberId_status_idx" ON "Purchase"("luckyNumberId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Winner_drawId_key" ON "Winner"("drawId");

-- CreateIndex
CREATE UNIQUE INDEX "Winner_luckyNumberId_key" ON "Winner"("luckyNumberId");

-- CreateIndex
CREATE INDEX "Winner_drawId_userId_luckyNumberId_idx" ON "Winner"("drawId", "userId", "luckyNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_purchaseId_key" ON "Transaction"("purchaseId");

-- CreateIndex
CREATE INDEX "Transaction_userId_purchaseId_status_id_idx" ON "Transaction"("userId", "purchaseId", "status", "id");

-- CreateIndex
CREATE INDEX "Log_isBackend_timestamp_idx" ON "Log"("isBackend", "timestamp");

-- CreateIndex
CREATE INDEX "Log_type_timestamp_idx" ON "Log"("type", "timestamp");

-- CreateIndex
CREATE INDEX "_LuckyNumberToPurchase_B_index" ON "_LuckyNumberToPurchase"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LuckyNumber" ADD CONSTRAINT "LuckyNumber_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_luckyNumberId_fkey" FOREIGN KEY ("luckyNumberId") REFERENCES "LuckyNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LuckyNumberToPurchase" ADD CONSTRAINT "_LuckyNumberToPurchase_A_fkey" FOREIGN KEY ("A") REFERENCES "LuckyNumber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LuckyNumberToPurchase" ADD CONSTRAINT "_LuckyNumberToPurchase_B_fkey" FOREIGN KEY ("B") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
