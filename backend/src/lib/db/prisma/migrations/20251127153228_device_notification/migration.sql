-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(255),
    "token" TEXT NOT NULL,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_token_key" ON "Device"("token");
