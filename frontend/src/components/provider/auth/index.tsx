import axiosInstance from '@/src/utils/api';
import { logger } from '@/src/utils/logger';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingScreen } from '../../common/LoadingScreen';
import { toast } from 'sonner-native';
import { AuthContext } from '@lib/context/auth';
import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { AuthContextT, AuthUserT } from '@/src/types/context/auth';

type AuthProviderProps = Readonly<{ children: React.ReactNode }>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isTokenSet, setIsTokenSet] = useState(false);

  const { isFetching, data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => http.get<AuthUserT>(`/auth`),
    select: (data) => data.data,
    enabled: !!isSignedIn && isTokenSet,
  });
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

  const value = {
    user: data,
    isAuthLoading: isFetching,
    isSuperAdmin: data?.role === 'SUPER_ADMIN' || false,
  } satisfies AuthContextT;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
