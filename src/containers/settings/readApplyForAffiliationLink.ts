import { ReadApplyForAffiliationLink } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function readApplyForAffiliationLink(): Promise<ReadApplyForAffiliationLink['Response']> {
  const request: ReadApplyForAffiliationLink['Request'] = {
    url: '/ReadApplyForAffiliationLink',
    method: 'GET',
  };

  const response = await apiClient.request<ReadApplyForAffiliationLink['Response']>(request);

  return response.data;
}
