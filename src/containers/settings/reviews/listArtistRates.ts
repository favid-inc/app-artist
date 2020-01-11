import { ListArtistRates as Action } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function listArtistRates(): Promise<Action['Response']> {
  const request: Action['Request'] = {
    url: '/ListArtistRates',
    method: 'GET',
  };

  const response = await apiClient.request<Action['Response']>(request);

  return response.data;
}
