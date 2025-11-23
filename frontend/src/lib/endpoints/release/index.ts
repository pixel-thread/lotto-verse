import { EndpointT } from '@/src/types/endpoints';

type ReleaseEndpoints = 'GET_LATEST_RELEASE';

export const RELEASE_ENDPOINTS: EndpointT<ReleaseEndpoints> = {
  GET_LATEST_RELEASE: '/release/latest',
};
