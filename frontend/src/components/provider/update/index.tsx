import {
  applyUpdateNow,
  checkForAndHandleUpdates,
} from '@/src/services/update/checkForAndHandleUpdates';
import React, { useEffect, useState } from 'react';
import { UpdateDialog } from '../../common/app-update/UpdateDialog';

type Props = Readonly<{ children: React.ReactNode }>;

export default function EASUpdateProvider({ children }: Props) {
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    loading?: boolean;
    onConfirm?: () => void;
  }>({ visible: false, title: '', message: '' });

  useEffect(() => {
    checkForAndHandleUpdates(
      () =>
        setDialog({
          visible: true,
          title: 'Update Available',
          message: 'A new version is available.',
          onConfirm: () => {
            setDialog({
              visible: true,
              title: 'Downloading',
              message: 'Please wait while the update downloads.',
              loading: true,
            });
          },
        }),
      () => {},
      () =>
        setDialog({
          visible: true,
          title: 'Update Ready',
          message: 'Restart app to apply update.',
          onConfirm: applyUpdateNow,
        }),
      (err) =>
        setDialog({
          visible: true,
          title: 'Update Error',
          message: err.message,
        })
    );
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <UpdateDialog {...dialog} />
    </>
  );
}
