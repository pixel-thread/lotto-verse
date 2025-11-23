import { AuthContext } from '@/src/lib/context/auth';
import React from 'react';

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
