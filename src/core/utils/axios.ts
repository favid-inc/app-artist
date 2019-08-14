import axiosRaw from 'axios';
import * as firebase from 'firebase';

import * as config from '@src/core/config';

export const axios = axiosRaw.create({
  baseURL: config.api.baseURL,
});

firebase.auth().onIdTokenChanged(async auth => {
  const idToken = await auth.getIdToken();
  axios.defaults.headers.commons.Authorization = `Bearer ${idToken}`;
});
