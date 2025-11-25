import { UpdateReleaseT } from '@/src/types/update';

export const MOCK_UPDATES: UpdateReleaseT[] = [
  {
    id: '1',
    channel: 'production',
    type: 'PTA',
    runtimeVersion: '1.0.0',
    releaseName: 'Initial Release',
    publishedAt: new Date('2023-08-01'),
    isMandatory: true,
    minAppVersion: '1.0.0',
    rolloutPercent: 100,
    releaseNotes: 'Initial app release with core features.',
    assetUrl: 'https://example.com/asset1',
    createdBy: 'Admin',
    metadata: {},
  },
  {
    id: '2',
    channel: 'beta',
    type: 'OTA',
    runtimeVersion: '1.0.1',
    releaseName: 'Minor Fix',
    publishedAt: new Date('2023-08-15'),
    isMandatory: false,
    minAppVersion: '1.0.0',
    rolloutPercent: 50,
    releaseNotes: 'Bug fixes and performance improvements.',
    assetUrl: 'https://example.com/asset2',
    createdBy: 'Tester',
    metadata: {},
  },
];
