import { UploadProfileVideo } from '@favid-inc/api/lib/app-artist';
import axios, { Canceler, CancelToken as CancelTokenType } from 'axios';

export const CancelToken = axios.CancelToken;

export { Canceler };
import { apiClient } from '@src/core/utils/apiClient';

export async function uploadProfileVideo(
  uri: string,
  cancelToken: CancelTokenType,
  onProgress: (percentage: number) => void,
): Promise<UploadProfileVideo['Response']> {
  const filename = uri.split('/').pop();
  const ext = filename.split('.').pop();

  const data = new FormData();

  data.append('video', {
    uri,
    name: filename,
    type: `video/${ext}`,
  });

  const request: UploadProfileVideo['Request'] = {
    url: '/UploadProfileVideo',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<UploadProfileVideo['Response']>({
    ...request,
    cancelToken,
    onUploadProgress(progressEvent) {
      onProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
    },
  });

  return response.data;
}
