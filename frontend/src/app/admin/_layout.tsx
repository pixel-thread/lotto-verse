import { useAuth } from '@/src/hooks/auth/useAuth';
import { logger } from '@/src/utils/logger';
import { Redirect, Stack } from 'expo-router';

export default function page() {
  const { isSuperAdmin, user } = useAuth();

  if (!isSuperAdmin) {
    logger.info('Permission denied: Not super admin', { user: user });
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
