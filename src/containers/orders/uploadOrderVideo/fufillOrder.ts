import { Order } from '@favid-inc/api';
import axios, { Canceler, CancelToken as CancelTokenType } from 'axios';

export const CancelToken = axios.CancelToken;

export { Canceler };

import { FulfillOrder } from '@favid-inc/api/lib/app-artist';

import { apiClient } from '@src/core/utils/apiClient';

export async function fufillOrder(
  order: Order,
  cancelToken: CancelTokenType,
  onProgress: (percentage: number) => void,
): Promise<FulfillOrder['Response']> {
  const { id, videoUri } = order;

  if (!id) {
    throw new Error(`fufillOrder: id is invalid: "${id}"`);
  }

  if (!videoUri || !videoUri.startsWith('file://') || !videoUri.endsWith('.mp4')) {
    throw new Error(`fufillOrder: video format is invalid: "${videoUri}"`);
  }

  const data = new FormData();

  data.append('id', id);

  const filename = order.videoUri.split('/').pop();
  const ext = filename.split('.').pop();

  data.append('video', {
    uri: videoUri,
    name: filename,
    type: `video/${ext}`,
  });

  const request: FulfillOrder['Request'] = {
    url: '/FulfillOrder',
    method: 'POST',
    data,
  };

  const response = await apiClient.request<FulfillOrder['Response']>({
    ...request,
    cancelToken,
    onUploadProgress(progressEvent) {
      onProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
    },
  });

  return response.data;
}
