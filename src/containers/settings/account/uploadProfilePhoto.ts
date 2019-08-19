import { UploadProfilePhoto } from '@favid-inc/api/lib/app-artist';
import axios, { Canceler, CancelToken as CancelTokenType } from 'axios';

export const CancelToken = axios.CancelToken;

export { Canceler };
import { apiClient } from '@src/core/utils/apiClient';

export async function uploadProfilePhoto(
  uri: string,
  cancelToken: CancelTokenType,
): Promise<UploadProfilePhoto['Response']> {
  const filename = uri.split('/').pop();
  const ext = filename.split('.').pop();

  const data = new FormData();

  data.append('photo', {
    uri,
    name: filename,
    type: `image/${ext}`,
  });

  const request: UploadProfilePhoto['Request'] = {
    url: '/UploadProfilePhoto',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<UploadProfilePhoto['Response']>({
    ...request,
    cancelToken,
  });

  return response.data;
}
