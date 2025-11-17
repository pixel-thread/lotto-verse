import * as Updates from 'expo-updates';

export async function checkForAndHandleUpdates(
  onUpdateAvailable: () => void,
  onNoUpdate: () => void,
  onUpdateReady: () => void,
  onError: (err: Error) => void
) {
  try {
    const isOnline = await checkInternet();
    if (!isOnline) {
      return;
    }

    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      onUpdateAvailable();

      const fetched = await Updates.fetchUpdateAsync();
      if (fetched.isNew) {
        onUpdateReady();
      } else {
        onNoUpdate();
      }
    } else {
      onNoUpdate();
    }
  } catch (error: any) {
    onError(error instanceof Error ? error : new Error('Update failed.'));
  }
}

export async function applyUpdateNow() {
  try {
    await Updates.reloadAsync();
  } catch (err) {
    console.error('Failed to reload app:', err);
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
