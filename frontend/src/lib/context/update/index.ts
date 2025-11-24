import { UpdateContextT } from '@/src/types/update';
import React from 'react';

export const UpdateContext = React.createContext<UpdateContextT | null>(null);
