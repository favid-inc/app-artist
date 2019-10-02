import { Artist } from '@favid-inc/api';
import { CreateWallet } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function updateProfile(data: CreateWallet['Request']['data']): Promise<CreateWallet['Response']> {
  const request: CreateWallet['Request'] = {
    url: '/CreateWallet',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<CreateWallet['Response']>(request);

  return response.data;
}
