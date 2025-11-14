import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import http from '@/src/utils/http';
import { useQuery } from '@tanstack/react-query';

type DrawUserT = {
  id: number | string;
  name: string;
  email: string;
  purchaseAt: string;
  number: number;
  imageUrl: string;
};

export function useCurrentDrawUser() {
  return useQuery({
    queryKey: ['current', 'draw', 'users'],
    queryFn: () => http.get<DrawUserT[]>(DRAW_ENDPOINTS.GET_ACTIVE_DRAW_USERS),
    select: (data) => data.data,
  });
}
