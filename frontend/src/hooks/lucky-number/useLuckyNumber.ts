import { LUCKY_NUMBER_ENDPOINTS } from '@/src/lib/endpoints/lucky-number';
import { LuckyNumbersT as LuckyNumberT } from '@/src/types/lucky-number';
import http from '@/src/utils/http';
import { useQuery } from '@tanstack/react-query';

export function useLuckyNumber({ id }: { id: string }) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () =>
      http.get<LuckyNumberT>(LUCKY_NUMBER_ENDPOINTS.GET_LUCKY_NUMBER.replace(':id', id)),
    select: (data) => data.data,
    enabled: !!id,
  });
}
