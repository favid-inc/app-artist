import { ClaimProfile } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function claimAccount(idToken: string): Promise<ClaimProfile['Response']> {
  const request: ClaimProfile['Request'] = {
    url: '/ClaimProfile',
    method: 'POST',
    data: {
      idToken,
    },
  };

  const response = await apiClient.request<ClaimProfile['Response']>(request);
  return response.data;
}
