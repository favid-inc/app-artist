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

  if (!videoUri || !videoUri.startsWith('file://') || !videoUri.endsWith('.mp4')) {
    throw new Error(`fufillOrder: video format is invalid: "${videoUri}"`);
  }

  const data = new FormData();

  data.append('id', id);

  data.append('video', {
    type: 'video/mp4',
    uri: videoUri,
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
