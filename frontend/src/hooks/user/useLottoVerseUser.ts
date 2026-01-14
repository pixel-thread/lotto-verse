import { USER_ENDPOINTS } from '@/src/lib/endpoints/user';
import http from '@/src/utils/http';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

type UserT = {
  memberSince: string;
  totalDrawParticipate: string;
  totalWin: string;
  totalDrawSpend: string;
  role: 'SUPER_ADMIN' | 'USER' | null;
};
export function useLottoVerseUser() {
  const { user } = useUser();
  return useQuery({
    queryKey: ['lotto-verse-user', user?.id],
    queryFn: () => http.get<UserT>(USER_ENDPOINTS.GET_USER),
    select: (data) => data.data,
  });
}
