import { LoadProfile } from '@favid-inc/api/lib/app-artist';
import * as firebase from 'firebase';

import { apiClient } from '@src/core/utils/apiClient';

export async function loadProfile(): Promise<LoadProfile['Response']> {
  const request: LoadProfile['Request'] = {
    url: '/LoadProfile',
    method: 'GET',
  };

  try {
    const response = await apiClient.request<LoadProfile['Response']>(request);
    return response.data;
  } catch (e) {
    const user = firebase.auth().currentUser;
    return {
      artisticName: user.displayName,
      biography: '',
      categories: [],
      email: user.email,
      location: '',
      mainCategory: '',
      name: user.displayName,
      phone: '',
      photoUri: user.photoURL,
      price: 0,
    };
  }
}
