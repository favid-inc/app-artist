import { CensorArtistRate as Action } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function censorArtistRate(artistRateId: number): Promise<Action['Response']> {
  const request: Action['Request'] = {
    url: '/CensorArtistRate',
    method: 'POST',
    data: {
      artistRateId,
    },
  };

  const response = await apiClient.request<Action['Response']>(request);

  return response.data;
}
