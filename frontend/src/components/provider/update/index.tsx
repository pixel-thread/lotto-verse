import React, { useEffect, useMemo } from 'react';
import { UpdateModal } from '../../common/app-update/UpdateModal';
import { useQuery } from '@tanstack/react-query';
import { RELEASE_ENDPOINTS } from '@/src/lib/endpoints/release';
import http from '@/src/utils/http';
import { UpdateContext } from '@/src/lib/context/update';
import { UpdateReleaseT } from '@/src/types/update';
import { compareAppVersions } from '@/src/utils/update';
import { checkForAndHandleUpdates } from '@/src/services/update/checkForAndHandleUpdates';
import * as Constants from 'expo-constants';

type Props = Readonly<{ children: React.ReactNode }>;

export default function EASUpdateProvider({ children }: Props) {
  const currentAppVersion = Constants.default.expoConfig?.version || '0.0.1';
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['latest', 'release'],
    queryFn: () => http.get<UpdateReleaseT>(RELEASE_ENDPOINTS.GET_LATEST_RELEASE),
    select: (res) => res.data,
    refetchInterval: 1000 * 60 * 5, // Every 5 mins
  });

  console.log(compareAppVersions(currentAppVersion, data?.version));

  const value = useMemo(
    () => ({
      release: data,
      isNewReleaseAvailable: compareAppVersions(currentAppVersion, data?.version),
      isMandetory: data?.type === 'PTA',
      isLoading: isFetching || isLoading,
      currentVersion: currentAppVersion,
    }),
    [data]
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      checkForAndHandleUpdates();
    }
  }, []);

  return (
    <UpdateContext.Provider value={value}>
      <UpdateModal />
      {children}
    </UpdateContext.Provider>
  );
}
