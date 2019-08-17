import { Artist } from '@favid-inc/api';
import { UpdateProfile } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function updateProfile(data: Artist): Promise<UpdateProfile['Response']> {
  const request: UpdateProfile['Request'] = {
    url: '/UpdateProfile',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<UpdateProfile['Response']>(request);

  return response.data;
}
