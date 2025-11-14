import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import http from '@/src/utils/http';
import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { DrawT } from '@/src/types/draw';

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
