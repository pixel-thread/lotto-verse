import { handleApiErrors } from "@/src/utils/errors/handleApiErrors";
import { SuccessResponse } from "@/src/utils/next-response";
import { NextRequest } from "next/server";

type ReleaseT = {
  id: string;
  channel: string;
  runtimeVersion: string;
  releaseName: string | null;
  publishedAt: Date;
  isMandatory: boolean;
  minAppVersion: string | null;
  rolloutPercent: number;
  releaseNotes: string | null;
  assetUrl: string | null;
  createdBy: string | null;
  metadata: any;
};

export const MOCK_MANDATORY_UPDATE: ReleaseT = {
  id: "rel_mandatory_001",
  channel: "production",
  runtimeVersion: "2.1.0",
  releaseName: "v2.1.0",
  publishedAt: new Date("2025-11-18T14:30:00Z"),
  isMandatory: true,
  minAppVersion: "2.0.0",
  rolloutPercent: 100,
  releaseNotes: `• Critical security patch for user authentication
• Fixed payment gateway timeout issues
• Improved app stability and performance
• Fixed crash on profile page
• Updated dependencies to latest versions`,
  assetUrl: "https://cdn.example.com/updates/v2.1.0.bundle",
  createdBy: "admin@example.com",
  metadata: {
    buildNumber: 42,
    changelog: ["security", "bugfix", "performance"],
    releaseType: "hotfix",
  },
};

export const MOCK_OPTIONAL_UPDATE: ReleaseT = {
  id: "rel_optional_002",
  channel: "production",
  runtimeVersion: "2.0.5",
  releaseName: "v2.0.5",
  publishedAt: new Date("2025-11-15T10:00:00Z"),
  isMandatory: false,
  minAppVersion: "1.9.0",
  rolloutPercent: 75,
  releaseNotes: `• New dark mode theme improvements
• Added new confetti animation for winners
• Enhanced lucky draw UI with smooth transitions
• Improved tournament bracket visualization
• Better offline mode support
• Minor bug fixes and UI polish`,
  assetUrl: "https://cdn.example.com/updates/v2.0.5.bundle",
  createdBy: "harrison@example.com",
  metadata: {
    buildNumber: 38,
    changelog: ["feature", "ui", "enhancement"],
    releaseType: "feature",
    featureFlags: {
      newDarkMode: true,
      enhancedAnimations: true,
    },
  },
};

export const MOCK_MINOR_UPDATE: ReleaseT = {
  id: "rel_minor_003",
  channel: "production",
  runtimeVersion: "2.0.1",
  releaseName: "v2.0.1",
  publishedAt: new Date("2025-11-10T08:00:00Z"),
  isMandatory: false,
  minAppVersion: "2.0.0",
  rolloutPercent: 50,
  releaseNotes: `• Performance improvements for leaderboard loading
• Fixed notification badge count
• Updated localization strings`,
  assetUrl: "https://cdn.example.com/updates/v2.0.1.bundle",
  createdBy: "dev@example.com",
  metadata: {
    buildNumber: 35,
    changelog: ["bugfix", "performance"],
    releaseType: "patch",
  },
};

export const MOCK_MAJOR_UPDATE: ReleaseT = {
  id: "rel_major_004",
  channel: "production",
  runtimeVersion: "3.0.0",
  releaseName: "v3.0.0 - Major Update",
  publishedAt: new Date("2025-11-19T12:00:00Z"),
  isMandatory: true,
  minAppVersion: "2.5.0",
  rolloutPercent: 100,
  releaseNotes: `🎉 Major Update - v3.0.0

• Complete UI redesign with modern interface
• New social features - share results with friends
• Live tournament streaming support
• In-app chat and messaging
• Improved rewards and loyalty program
• Enhanced security with biometric authentication
• Complete database migration for better performance
• Breaking changes - requires app restart`,
  assetUrl: "https://cdn.example.com/updates/v3.0.0.bundle",
  createdBy: "harrison@example.com",
  metadata: {
    buildNumber: 50,
    changelog: ["major", "feature", "breaking"],
    releaseType: "major",
    migrationRequired: true,
    featureFlags: {
      socialFeatures: true,
      liveStreaming: true,
      biometricAuth: true,
    },
  },
};

// Example usage in your component for testing:
export const MOCK_DATA_FOR_TESTING = {
  mandatory: MOCK_MANDATORY_UPDATE,
  optional: MOCK_OPTIONAL_UPDATE,
  minor: MOCK_MINOR_UPDATE,
  major: MOCK_MAJOR_UPDATE,
};

export async function GET(req: NextRequest) {
  try {
    return SuccessResponse({
      data: null,
      message: "Success fetching update info",
    });
  } catch (error) {
    return handleApiErrors(error);
  }
}
