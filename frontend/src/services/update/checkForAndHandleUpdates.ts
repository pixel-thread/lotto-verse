import { logger } from '@/src/utils/logger';
import * as Updates from 'expo-updates';

export async function checkForAndHandleUpdates() {
  try {
    const isOnline = await checkInternet();
    if (!isOnline) {
      return;
    }

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      const fetched = await Updates.fetchUpdateAsync();

      if (fetched.isNew) {
        await Updates.reloadAsync();
      }
    }
  } catch (error: any) {
    logger.error('Failed to check for updates', error);
  }
}

async function checkInternet() {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}
