import { createDrawSchema } from '@/src/utils/validation/draw';
import z from 'zod';

export type WinnerT = {
  id: string;
  userId: string;
  name: string;
  number: number;
  isPaid: boolean;
  imageUrl: string;
  purchaseAt: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type DrawT = z.infer<typeof createDrawSchema> & {
  createdAt: string;
  isWinnerDecleared: boolean;
  endDate: string;
  winner: WinnerT | null;
};
