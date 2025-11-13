import axiosInstance from '@/src/utils/api';
import { logger } from '@/src/utils/logger';
import { useAuth, useSession } from '@clerk/clerk-expo';
import { useCallback, useEffect, useState } from 'react';
import { LoadingScreen } from '../../common/LoadingScreen';

type AuthProviderProps = Readonly<{ children: React.ReactNode }>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, isSignedIn } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Get Token from Clerk
  const getClerkToken = useCallback(async () => {
    if (isSignedIn) {
      logger.log('Getting Token..');
      const token = await getToken({ template: 'jwt' });
      if (token) {
        logger.log('Setting Token..');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsTokenSet(true);
        logger.log('Token Set');
        return token;
      }
      logger.log('No Token Set');
      axiosInstance.defaults.headers.common['Authorization'] = '';
      return;
    }
  }, [isSignedIn]);

  // Clear token if user is logout
  const clearToken = useCallback(() => {
    logger.log('Clearing Token..');
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

  if (isSignedIn && !isTokenSet) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
