import * as Application from 'expo-application';
import Constants from 'expo-constants';

export function getAppInfo() {
  const nativeVersion = Application.nativeApplicationVersion || '0.0.0';
  const jsVersion = Constants.expoConfig?.version || '0.0.0';
  return {
    nativeVersion,
    jsVersion,
  };
}
