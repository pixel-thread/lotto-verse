import { EndpointT } from '@/src/types/endpoints';

type LogEndpoints = 'POST_ADD_LOG' | 'GET_LOGS';

export const LOG_ENDPOINTS: EndpointT<LogEndpoints> = {
  POST_ADD_LOG: '/logs',
  GET_LOGS: '/logs',
};
