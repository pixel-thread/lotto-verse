// app.config.js
export default ({ config }) => {
  return {
    ...config,
    expo: {
      name: 'Lotto Verse',
      slug: 'lucky-draw',
      version: '1.0.1',
      scheme: 'lottoverse',
      platforms: ['ios', 'android'],
      plugins: ['expo-router', 'expo-font', 'expo-notifications'],
      experiments: {
        typedRoutes: true,
        tsconfigPaths: true,
      },
      orientation: 'portrait',
      icon: './src/assets/icons/android-icon/play_store_512.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './src/assets/icons/android-icon/play_store_512.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.jyrwaboys.frontend',
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './src/assets/icons/android-icon/play_store_512.png',
          backgroundColor: '#ffffff',
        },
        package: 'com.jyrwaboys.frontend',
        // ✅ Uses your EAS secret automatically
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        intentFilters: [
          {
            action: 'VIEW',
            category: ['BROWSABLE', 'DEFAULT'],
            autoVerify: true,
            data: [
              {
                scheme: 'https',
                host: 'lotto-verse.vercel.app',
                pathPrefix: '/',
              },
            ],
          },
        ],
      },
      extra: {
        router: {},
        eas: {
          projectId: '902c84ad-eca6-4545-8235-b3bd9ace3129',
        },
      },
      owner: 'pixel-thread',
      updates: {
        url: 'https://u.expo.dev/902c84ad-eca6-4545-8235-b3bd9ace3129',
        enabled: true,
        checkAutomatically: 'ON_LOAD',
        fallbackToCacheTimeout: 0,
      },
      runtimeVersion: {
        policy: 'appVersion',
      },
    },
  };
};
