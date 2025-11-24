import { UpdateContext } from '@/src/lib/context/update';
import React from 'react';

export function useUpdateContext() {
  const context = React.useContext(UpdateContext);
  if (!context) {
    throw new Error('useUpdateContext must be used within a UpdateProvider');
  }
  return context;
}
