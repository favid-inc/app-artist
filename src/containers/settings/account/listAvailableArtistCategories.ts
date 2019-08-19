import { ListAvailableArtistCategories } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function listAvailableArtistCategories(): Promise<ListAvailableArtistCategories['Response']> {
  const request: ListAvailableArtistCategories['Request'] = {
    url: '/ListAvailableArtistCategories',
    method: 'GET',
  };

  const response = await apiClient.request<ListAvailableArtistCategories['Response']>(request);

  return response.data;
}
