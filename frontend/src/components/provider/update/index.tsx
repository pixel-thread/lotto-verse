import { checkForAndHandleUpdates } from '@/src/services/update/checkForAndHandleUpdates';
import React, { useEffect } from 'react';

type Props = Readonly<{ children: React.ReactNode }>;

export default function EASUpdateProvider({ children }: Props) {
  useEffect(() => {
    checkForAndHandleUpdates();
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  return <>{children}</>;
}
