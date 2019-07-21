import { SIGN_IN, SIGN_OUT, SIGN_IN_STARTED, SIGN_IN_ENDED, SIGN_IN_ERROR } from '../actions/ActionTypes';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';

const INITIAL_STATE = {
  authState: {
    uid: null,
    displayName: null,
    photoURL: null,
    email: null,
    refreshToken: null,
    accessToken: null,
    expirationTime: null,
    redirectEventId: null,
    lastLoginAt: null,
    createdAt: null,
  },
  error: null,
  loading: false,
};

const signIn = (state, action) => {
  return {
    ...state,
    authState: {
      ...action.authState,
    },
  };
};

const signOut = state => {
  return {
    ...state,
    authState: {
      uid: null,
      displayName: null,
      photoURL: null,
      email: null,
      refreshToken: null,
      accessToken: null,
      expirationTime: null,
      redirectEventId: null,
      lastLoginAt: null,
      createdAt: null,
    },
  };
};

const signInStarted = state => {
  return {
    ...state,
    loading: true,
  };
};

const signInEnded = state => {
  return {
    ...state,
    loading: false,
  };
};

const signInError = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.error,
  };
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return signIn(state, action);
    case SIGN_OUT:
      return signOut(state);
    case SIGN_IN_STARTED:
      return signInStarted(state);
    case SIGN_IN_ENDED:
      return signInEnded(state);
    case SIGN_IN_ERROR:
      return signInError(state, action);
    default:
      return state;
  }
};

export default authReducer;
