import { ListOrders as Action } from '@favid-inc/api/lib/app-artist';
import { apiClient } from '@src/core/utils/apiClient';
import { OrderStatus } from '@favid-inc/api';

export async function listOrders(): Promise<Action['Response']> {
  const request: Action['Request'] = {
    url: '/ListOrders',
    method: 'GET',
    params: {
      orderStatus: OrderStatus.FULFILLED,
    },
  };

  const response = await apiClient.request<Action['Response']>(request);

  return response.data;
}
