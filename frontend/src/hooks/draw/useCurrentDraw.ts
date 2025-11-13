import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import http from '@/src/utils/http';
import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import z from 'zod';
import { createDrawSchema } from '@/src/utils/validation/draw';

type WinnerT = {
  id: string;
  userId: string;
  name: string;
  number: number;
  isPaid: boolean;
  imageUrl: string;
  purchaseAt: string;
  email: string;
  phone: string;
};

type DrawT = z.infer<typeof createDrawSchema> & {
  createdAt: string;
  isWinnerDecleared: boolean;
  endDate: string;
  winner: WinnerT | null;
};

export function useCurrentDraw() {
  const query = useQuery({
    queryKey: ['current', 'draw'],
    queryFn: () => http.get<DrawT>(DRAW_ENDPOINTS.GET_ACTIVE_DRAW),
    select: (data) => data.data,
  });

  useEffect(() => {
    if (!query.data?.endDate) return;

    const now = new Date();
    const targetDate = new Date(query.data.endDate);

    // Set target time to 6:00 PM local on endDate
    targetDate.setHours(18, 0, 0, 0);

    const delay = targetDate.getTime() - now.getTime();

    if (delay <= 0) return;

    const timer = setTimeout(() => {
      query.refetch();
    }, delay);

    return () => clearTimeout(timer);
  }, [query.data?.endDate]);

  return query;
}
