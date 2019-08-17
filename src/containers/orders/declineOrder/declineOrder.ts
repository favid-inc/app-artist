import { Order } from '@favid-inc/api';
import { DeclineOrder } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function declineOrder(order: Order): Promise<DeclineOrder['Response']> {
  const request: DeclineOrder['Request'] = {
    url: '/DeclineOrder',
    method: 'POST',
  };

  const response = await apiClient.request<DeclineOrder['Response']>(request);

  return response.data;
}
