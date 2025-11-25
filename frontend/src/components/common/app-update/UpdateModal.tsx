import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { formatDate } from '@/src/utils/helper/formatDate';
import { logger } from '@/src/utils/logger';
import { useUpdateContext } from '@/src/hooks/update';

type UpdateState = 'idle' | 'checking' | 'downloading' | 'ready' | 'error';

export const UpdateModal: React.FC = () => {
  const { release, isLoading, isNewReleaseAvailable, currentVersion } = useUpdateContext();
  const [updateState, setUpdateState] = useState<UpdateState>('idle');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(isNewReleaseAvailable);

  useEffect(() => {
    setIsVisible(isNewReleaseAvailable);
  }, [isNewReleaseAvailable]);

  const handleOtaUpdate = async () => {
    if (__DEV__) {
      setUpdateState('idle');
      setUpdateError('Updates not available in development mode');
      return;
    }
    try {
      setUpdateState('checking');
      setUpdateError(null);
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateState('downloading');
        await Updates.fetchUpdateAsync();
        setUpdateState('ready');
        await Updates.reloadAsync();
      } else {
        setUpdateState('idle');
        setUpdateError('No updates available');
      }
    } catch (error) {
      setUpdateState('error');
      setUpdateError(error instanceof Error ? error.message : 'Failed to update');
      logger.error('Update error: OTA', error);
    }
  };

  const handleMandatoryUpdate = async () => {
    try {
      if (release?.assetUrl) {
        Linking.openURL(release?.assetUrl);
      }
    } catch (error) {
      logger.error('Unable to open assetUrl: PTA', error);
    }
  };

  const handleUpdate = async () => {
    if (release) {
      if (release.type === 'PTA') {
        await handleMandatoryUpdate();
        return;
      } else {
        setIsVisible(false);
        await handleOtaUpdate();
      }
    }
  };

  const handleRemindLater = () => {
    setIsVisible(false);
  };

  const getUpdateButtonText = () => {
    switch (updateState) {
      case 'checking':
        return 'Checking...';
      case 'downloading':
        return 'Downloading...';
      case 'ready':
        return 'Applying Update...';
      case 'error':
        return 'Retry Update';
      default:
        return release?.isMandatory ? 'Update Now' : 'Install Update';
    }
  };

  if (isLoading || !isVisible) return null;
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated>
      <TouchableWithoutFeedback onPress={release?.isMandatory ? undefined : handleRemindLater}>
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900">
              <View className="items-center bg-gradient-to-b from-black to-transparent pb-6 pt-8 dark:from-neutral-950/30">
                <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                  <Ionicons name="rocket" size={40} color="#3b82f6" />
                </View>
                <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Update Available
                </Text>
                <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Version {release?.releaseName || release?.runtimeVersion}
                </Text>
              </View>
              <ScrollView className="max-h-96 px-6" showsVerticalScrollIndicator={false}>
                <View className="mb-5 gap-3">
                  <View className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800/50">
                    <View>
                      <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Current Version
                      </Text>
                      <Text className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
                        {currentVersion}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color="#6b7280" />
                    <View>
                      <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        New Version
                      </Text>
                      <Text className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
                        {release?.runtimeVersion}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    {release?.publishedAt && (
                      <View className="flex-1 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                        <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                          Released
                        </Text>
                        <Text className="mt-0.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {formatDate(release.publishedAt)}
                        </Text>
                      </View>
                    )}
                    {release?.rolloutPercent !== undefined && (
                      <View className="flex-1 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                        <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                          Rollout
                        </Text>
                        <Text className="mt-0.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {release.rolloutPercent}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {release?.releaseNotes && (
                  <View className="mb-5">
                    <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                      What's New
                    </Text>
                    <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
                      {release.releaseNotes}
                    </Text>
                  </View>
                )}
                {release?.isMandatory && (
                  <View className="mb-5 flex-row items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
                    <Ionicons name="alert-circle" size={20} color="#f59e0b" />
                    <Text className="flex-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                      Required update. Please install to continue using the app.
                    </Text>
                  </View>
                )}
                {updateError && (
                  <View className="mb-5 flex-row items-start gap-2 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-900/20">
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                    <Text className="flex-1 text-sm font-medium text-red-700 dark:text-red-400">
                      {updateError}
                    </Text>
                  </View>
                )}
              </ScrollView>
              <View className="gap-3 px-6 pb-6">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleUpdate}
                  disabled={updateState === 'downloading' || updateState === 'ready'}
                  className={`items-center rounded-2xl py-4 shadow-lg shadow-blue-500/30 ${
                    updateState === 'downloading' || updateState === 'ready'
                      ? 'bg-neutral-400'
                      : 'bg-blue-600'
                  }`}>
                  {updateState === 'downloading' || updateState === 'checking' ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator color="#fff" size="small" />
                      <Text className="text-base font-bold text-white">
                        {getUpdateButtonText()}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-base font-bold text-white">{getUpdateButtonText()}</Text>
                  )}
                </TouchableOpacity>
                {!release?.isMandatory && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleRemindLater}
                    className="items-center py-3">
                    <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                      Remind Me Later
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default UpdateModal;
