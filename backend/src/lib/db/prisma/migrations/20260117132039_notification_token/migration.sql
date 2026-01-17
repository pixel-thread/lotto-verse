-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "tokenId" TEXT;

-- CreateTable
CREATE TABLE "NotificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" "AppVersionPlatform" NOT NULL,
    "userId" TEXT,

    CONSTRAINT "NotificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationToken_token_key" ON "NotificationToken"("token");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "NotificationToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationToken" ADD CONSTRAINT "NotificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
