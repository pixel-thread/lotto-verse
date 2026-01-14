import { createDrawSchema } from '@/src/utils/validation/draw';
import z from 'zod';
import { PurchaseT } from '../purchase';

export type StatusT = 'ACTIVE' | 'INACTIVE' | 'DELETE';

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
  id: string;
  createdAt: string;
  entryFee: number;
  month: string;
  isWinnerDecleared: boolean;
  endDate: string;
  status: StatusT;
  winner: WinnerT | null;
  purchases: PurchaseT[];
};
