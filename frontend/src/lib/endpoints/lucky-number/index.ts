import { EndpointT } from '@/src/types/endpoints';

type LuckyNumberEndpoints = 'GET_LUCKY_NUMBER' | 'POST_SEARCH_LUCKY_NUMBER';

export const LUCKY_NUMBER_ENDPOINTS: EndpointT<LuckyNumberEndpoints> = {
  GET_LUCKY_NUMBER: '/lucky-numbers/:id',
  POST_SEARCH_LUCKY_NUMBER: '/lucky-numbers/search',
};
