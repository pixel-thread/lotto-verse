import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { DrawT } from '@/src/types/draw';
import http from '@/src/utils/http';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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
