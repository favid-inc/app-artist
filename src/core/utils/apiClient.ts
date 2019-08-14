import axiosRaw from 'axios';
import * as firebase from 'firebase';

import * as config from '@src/core/config';

export const apiClient = axiosRaw.create({
  baseURL: config.api.baseURL,
});

firebase.auth().onIdTokenChanged(async auth => {
  const idToken = await auth.getIdToken();
  apiClient.defaults.headers.commons.Authorization = `Bearer ${idToken}`;
});
