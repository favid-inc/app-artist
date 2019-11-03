import { CreateWallet } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function createWallet(data: CreateWallet['Request']['data']): Promise<CreateWallet['Response']> {
  const request: CreateWallet['Request'] = {
    url: '/CreateWallet',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<CreateWallet['Response']>(request);

  return response.data;
}
