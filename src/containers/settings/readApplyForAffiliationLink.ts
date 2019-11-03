import { ReadApplyForAffiliationLink } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function readApplyForAffiliationLink(): Promise<ReadApplyForAffiliationLink['Response']> {
  const request: ReadApplyForAffiliationLink['Request'] = {
    url: '/ReadApplyForAffiliationLink',
    method: 'GET',
  };

  const {
    config: { baseURL },
    data: { url },
  } = await apiClient.request<ReadApplyForAffiliationLink['Response']>(request);

  return {
    url: `${baseURL}/${url}`,
  };
}
