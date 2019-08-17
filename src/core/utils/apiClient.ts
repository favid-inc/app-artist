import * as config from '@src/core/config';
import axiosRaw from 'axios';

export const apiClient = axiosRaw.create({
  baseURL: config.api.baseURL,
  headers: {
    Accept: 'application/json',
  },
});
