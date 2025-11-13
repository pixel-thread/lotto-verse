import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useRefetchAt6PM(query: ReturnType<typeof useQuery>) {
  useEffect(() => {
    if (!query.data?.endDate) return;

    const now = new Date();
    const targetDate = new Date(query.data.endDate);

    // Set target time to 6PM local time on endDate
    targetDate.setHours(18, 0, 0, 0);

    // If targetDate already passed for today, do not set timeout
    if (targetDate <= now) return;

    const delay = targetDate.getTime() - now.getTime();

    const timer = setTimeout(() => {
      query.refetch();
    }, delay);

    return () => clearTimeout(timer);
  }, [query.data?.endDate, query.refetch]);
}
