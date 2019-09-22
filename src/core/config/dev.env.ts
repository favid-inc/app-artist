export const firebase = {
  apiKey: 'AIzaSyD2p48JEWILP-61UzBjIh-Yh6PWdrJrfwk',
  appId: '1:983263249595:web:698653dd4e439eb9',
  authDomain: 'onyx-harmony-239219.firebaseapp.com',
  databaseURL: 'https://onyx-harmony-239219.firebaseio.com',
  messagingSenderId: '983263249595',
  projectId: 'onyx-harmony-239219',
  storageBucket: 'onyx-harmony-239219.appspot.com',
};

export const api = {
  baseURL: 'http://<host>/api/appArtist',
};

export const auth = {
  google: {
    behavior: 'web',
    clientId: '983263249595-2tclp7pj3b23h05l08v8v7af6mgbud1s.apps.googleusercontent.com',
    issuer: 'https://accounts.google.com',
    scopes: ['profile', 'email'],
  },
  facebook: {
    appid: '642908949561774',
    options: {
      permissions: ['public_profile', 'email'],
    },
  },
};
