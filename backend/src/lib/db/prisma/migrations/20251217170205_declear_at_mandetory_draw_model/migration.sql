/*
  Warnings:

  - Made the column `declareAt` on table `Draw` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AppVersionTags" AS ENUM ('BETA', 'STABLE', 'BUGFIX', 'PATCH');

-- CreateEnum
CREATE TYPE "AppVersionType" AS ENUM ('PTA', 'OTA');

-- CreateEnum
CREATE TYPE "AppVersionPlatform" AS ENUM ('ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "EASBuildStatus" AS ENUM ('FINISHED', 'ERRORED', 'CANCELED');

-- AlterTable
ALTER TABLE "Draw" ALTER COLUMN "declareAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "AppVersion" (
    "id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT[],
    "type" "AppVersionType" NOT NULL DEFAULT 'PTA',
    "platforms" "AppVersionPlatform"[] DEFAULT ARRAY['ANDROID', 'IOS']::"AppVersionPlatform"[],
    "releaseNotesUrl" TEXT,
    "downloadUrl" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minSupportedVersion" TEXT,
    "author" TEXT,
    "tags" "AppVersionTags"[] DEFAULT ARRAY['STABLE']::"AppVersionTags"[],
    "additionalInfo" JSONB,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "versionCode" INTEGER,
    "buildNumber" TEXT,
    "runtimeVersion" TEXT,

    CONSTRAINT "AppVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EASBuildWebhook" (
    "id" UUID NOT NULL,
    "buildId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "platform" "AppVersionPlatform" NOT NULL,
    "status" "EASBuildStatus" NOT NULL,
    "buildDetailsPageUrl" TEXT,
    "buildUrl" TEXT,
    "logsS3KeyPrefix" TEXT,
    "appVersion" TEXT,
    "appBuildVersion" TEXT,
    "buildProfile" TEXT,
    "distribution" TEXT,
    "runtimeVersion" TEXT,
    "channel" TEXT,
    "gitCommitHash" TEXT,
    "gitCommitMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "enqueuedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "errorCode" TEXT,
    "rawPayload" JSONB NOT NULL,

    CONSTRAINT "EASBuildWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppVersion_version_idx" ON "AppVersion"("version");

-- CreateIndex
CREATE UNIQUE INDEX "EASBuildWebhook_buildId_key" ON "EASBuildWebhook"("buildId");

-- CreateIndex
CREATE INDEX "EASBuildWebhook_platform_idx" ON "EASBuildWebhook"("platform");

-- CreateIndex
CREATE INDEX "EASBuildWebhook_status_idx" ON "EASBuildWebhook"("status");

-- CreateIndex
CREATE INDEX "EASBuildWebhook_completedAt_idx" ON "EASBuildWebhook"("completedAt");
