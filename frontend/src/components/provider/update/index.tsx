import React, { useEffect, useMemo } from 'react';
import { UpdateModal } from '../../common/app-update/UpdateModal';
import { useQuery } from '@tanstack/react-query';
import { RELEASE_ENDPOINTS } from '@/src/lib/endpoints/release';
import http from '@/src/utils/http';
import { UpdateContext } from '@/src/lib/context/update';
import { UpdateReleaseT } from '@/src/types/update';
import { compareVersions } from '@/src/utils/update';
import { getAppInfo } from '@/src/utils/update/getAppInfo';
import { checkForAndHandleUpdates } from '@/src/services/update/checkForAndHandleUpdates';

type Props = Readonly<{ children: React.ReactNode }>;

export default function EASUpdateProvider({ children }: Props) {
  const info = getAppInfo();
  const currentVersion = info.nativeVersion;

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['latest', 'release'],
    queryFn: () => http.get<UpdateReleaseT>(RELEASE_ENDPOINTS.GET_LATEST_RELEASE),
    select: (res) => res.data,
    refetchInterval: 1000 * 60 * 5, // Every 5 mins
  });

  const value = useMemo(
    () => ({
      release: data,
      isNewReleaseAvailable:
        compareVersions(data?.runtimeVersion || '', currentVersion) > 0 ? true : false,
      isMandetory: data?.isMandatory ?? false,
      isLoading: isFetching || isLoading,
      currentVersion: currentVersion,
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
