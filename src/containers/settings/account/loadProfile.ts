import { LoadProfile } from '@favid-inc/api/lib/app-artist';
import * as firebase from 'firebase';

import { apiClient } from '@src/core/utils/apiClient';

export async function loadProfile(): Promise<LoadProfile['Response']> {
  const request: LoadProfile['Request'] = {
    url: '/LoadProfile',
    method: 'GET',
  };

  const response = await apiClient.request<LoadProfile['Response']>(request);
  return response.data;
}
