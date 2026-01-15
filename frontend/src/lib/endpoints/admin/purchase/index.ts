import { EndpointT } from '@/src/types/endpoints';

type PurchaseEndpoints = 'POST_OFFLINE_PURCHASE';

export const ADMIN_PURCHASE_ENDPOINTS: EndpointT<PurchaseEndpoints> = {
  POST_OFFLINE_PURCHASE: '/admin/offline-purchase',
};
