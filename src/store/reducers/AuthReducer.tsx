import { SIGNIN, SIGNOUT, SIGNINSTARTED, SIGNINENDED, SIGNINERROR } from '../actions/ActionTypes';
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
    case SIGNIN:
      return signIn(state, action);
    case SIGNOUT:
      return signOut(state);
    case SIGNINSTARTED:
      return signInStarted(state);
    case SIGNINENDED:
      return signInEnded(state);
    case SIGNINERROR:
      return signInError(state, action);
    default:
      return state;
  }
};

export default authReducer;
