import { LoadWalletInfo } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function loadWalletInfo(): Promise<LoadWalletInfo['Response']> {
  const request: LoadWalletInfo['Request'] = {
    url: '/LoadWalletInfo',
    method: 'GET',
  };

  const response = await apiClient.request<LoadWalletInfo['Response']>(request);

  return response.data;
}
