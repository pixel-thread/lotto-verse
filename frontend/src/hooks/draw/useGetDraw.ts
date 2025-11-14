import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { MetaT } from '@/src/types/meta';
import http from '@/src/utils/http';
import { createDrawSchema } from '@/src/utils/validation/draw';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import z from 'zod';

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

type Props = {
  id: string;
};

export default function useGetDraw({ id }: Props) {
  return useQuery({
    queryKey: ['draw', id],
    retry: true,
    queryFn: () => http.get<DrawT>(DRAW_ENDPOINTS.GET_DRAW_BY_ID.replace(':id', id.toString())),
    placeholderData: keepPreviousData,
    select: (data) => data.data,
    enabled: !!id,
  });
}
