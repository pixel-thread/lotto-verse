type UpdateType = 'OTA' | 'PTA';
export type UpdateReleaseT = {
  id: string;
  channel: string;
  type: UpdateType;
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

export type UpdateContextT = {
  release: UpdateReleaseT | null | undefined;
  isNewReleaseAvailable: boolean;
  isMandetory: boolean;
  isLoading: boolean;
  currentVersion: string | null;
};
