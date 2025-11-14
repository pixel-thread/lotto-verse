import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { DrawT } from '@/src/types/draw';

export function useCurrentDraw() {
  return useQuery({
    queryKey: ['current', 'draw'],
    queryFn: () => http.get<DrawT>(DRAW_ENDPOINTS.GET_ACTIVE_DRAW),
    select: (data) => data.data,
    structuralSharing: true,
  });
}
