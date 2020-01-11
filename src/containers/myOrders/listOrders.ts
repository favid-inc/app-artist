import { ListOrders as Action } from '@favid-inc/api/lib/app-artist';
import { apiClient } from '@src/core/utils/apiClient';

export async function listOrders(): Promise<Action['Response']> {
  const request: Action['Request'] = {
    url: '/ListOrders',
    method: 'GET',
  };

  const response = await apiClient.request<Action['Response']>(request);

  return response.data;
}
