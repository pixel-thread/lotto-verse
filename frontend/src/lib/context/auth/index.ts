'use client';
import { AuthContextT } from '@/src/types/context/auth';
import React from 'react';

export const AuthContext = React.createContext<AuthContextT | null>(null);
