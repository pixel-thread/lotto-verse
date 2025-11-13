import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { MetaT } from '@/src/types/meta';
import http from '@/src/utils/http';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type LuckyNumbersT = { number: number; id: string; isPurchased: boolean };

type Props = {
  page?: number;
};

export default function useCurrentDrawNumbers({ page = 1 }: Props = { page: 1 }) {
  const [meta, setMeta] = useState<MetaT | null>(null);
  const query = useQuery({
    queryKey: ['current', 'luckyNumbers', page],
    retry: true,
    queryFn: () =>
      http.get<LuckyNumbersT[]>(
        DRAW_ENDPOINTS.GET_ACTIVE_DRAW_NUMBERS.replace(':page', page.toString())
      ),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (query.data?.meta) {
      setMeta(query.data.meta);
    }
  }, [query.data?.meta]);
  return { ...query, meta, data: query.data?.data };
}
