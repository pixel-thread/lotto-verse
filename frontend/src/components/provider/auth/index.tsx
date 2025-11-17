import axiosInstance from '@/src/utils/api';
import { logger } from '@/src/utils/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from '../../common/LoadingScreen';
import { toast } from 'sonner-native';

type AuthProviderProps = Readonly<{ children: React.ReactNode }>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, isSignedIn } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Get Token from Clerk
  const getClerkToken = useCallback(async () => {
    if (isSignedIn) {
      logger.info('Getting Token..');
      const token = await getToken({ template: 'jwt' });
      if (token) {
        logger.info('Setting Token..');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsTokenSet(true);
        logger.log('Token Set');
        return token;
      }
      logger.info('No Token Set');
      toast.error('Failed to get token from Clerk');
      axiosInstance.defaults.headers.common['Authorization'] = '';
      return;
    }
  }, [isSignedIn]);

  // Clear token if user is logout
  const clearToken = useCallback(() => {
    logger.info('Clearing Token..');
    axiosInstance.defaults.headers.common['Authorization'] = '';
  }, [isSignedIn, isTokenSet]);

  useEffect(() => {
    if (isSignedIn && !isTokenSet) {
      getClerkToken();
    }
  }, [isSignedIn, isTokenSet]);

  useEffect(() => {
    if (!isSignedIn && isTokenSet) {
      clearToken();
    }
  }, [isSignedIn, isTokenSet]);

  // BUG: Token Not Loaded
  if (isSignedIn && !isTokenSet) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
