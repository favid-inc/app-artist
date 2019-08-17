import { ListOrders } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function listOrders(): Promise<ListOrders['Response']> {
  const request: ListOrders['Request'] = {
    url: '/ListOrders',
    method: 'GET',
  };

  const response = await apiClient.request<ListOrders['Response']>(request);

  return response.data;
}
