import axiosInstance from '@/src/utils/api';
import { logger } from '@/src/utils/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from '../../common/LoadingScreen';
import { toast } from 'sonner-native';

type AuthProviderProps = Readonly<{ children: React.ReactNode }>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Get Token from Clerk
  const getClerkToken = useCallback(async () => {
    try {
      if (isSignedIn) {
        logger.info('Getting Token..', { userId });
        const token = await getToken({ template: 'jwt' });
        if (token) {
          logger.info('Setting Token', { userId });
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          logger.info('Token Set', { userId });
          setIsTokenSet(true);
          return token;
        }
        axiosInstance.defaults.headers.common['Authorization'] = '';
        return;
      }
    } catch (error) {
      toast.error('Failed to get token from Clerk');
      logger.error('Failed to get token from Clerk', { error, userId: userId });
    }
  }, [isSignedIn]);

  // Clear token if user is logout
  const clearToken = useCallback(() => {
    logger.info('Clearing Token..', { userId });
    axiosInstance.defaults.headers.common['Authorization'] = '';
    setIsTokenSet(false);
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

  if (isSignedIn && !isTokenSet) {
    logger.info('Failed to set token: Rendering Loading Screen', { userId });
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
