import { useAuth } from '@/src/hooks/auth/useAuth';
import { logger } from '@/src/utils/logger';
import { Redirect, Stack } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  if (!isSuperAdmin) {
    logger.info('Permission denied: Not admin', { userId: user?.id, role: user?.role });
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
