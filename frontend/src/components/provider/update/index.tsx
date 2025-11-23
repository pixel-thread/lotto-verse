import { checkForAndHandleUpdates } from '@/src/services/update/checkForAndHandleUpdates';
import React, { useEffect } from 'react';
import { UpdateModal } from '../../common/app-update/UpdateModal';

type Props = Readonly<{ children: React.ReactNode }>;

export default function EASUpdateProvider({ children }: Props) {
  useEffect(() => {
    checkForAndHandleUpdates();
  }, []);

  return (
    <>
      <UpdateModal />
      {children}
    </>
  );
}
