import { AsyncStorage } from 'react-native';
import { SIGNIN, SIGNOUT, SIGNINSTARTED, SIGNINENDED, SIGNINERROR } from './ActionTypes';
import * as config from '@src/core/config';
import { storageKeys } from '@src/core/config';
import { ArtistAccount as ArtistAccountModel } from '@src/core/model/artistAccount.model';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';
import * as firebase from 'firebase';

const storageKey = storageKeys.currentUser;

export const auth = authResult => {
  return async dispatch => {
    dispatch(signInStarted());
    const credential = firebase.auth.GoogleAuthProvider.credential(authResult.idToken, authResult.accessToken);
    const authData = await firebase.auth().signInWithCredential(credential);
    const data = JSON.parse(JSON.stringify(authData)).user;
    const artistAccount: ArtistAccountModel = {
      uid: data.uid,
      displayName: data.displayName,
      photoURL: data.photoURL,
      email: data.email,
      lastLoginAt: data.lastLoginAt,
      createdAt: data.createdAt,
    };
    const authState: AuthStateModel = {
      ...artistAccount,
      redirectEventId: data.redirectEventId,
      lastLoginAt: data.lastLoginAt,
      createdAt: data.createdAt,
    };
    dispatch(verifyArtistAccount(artistAccount));
    await AsyncStorage.setItem(storageKey, JSON.stringify(authState));
    dispatch(signIn(authState));
    dispatch(signInFinished());
  };
};

export const signIn = (authState: AuthStateModel) => {
  return {
    type: SIGNIN,
    authState,
  };
};

export const signInStarted = () => {
  return {
    type: SIGNINSTARTED,
  };
};

export const signInFinished = () => {
  return {
    type: SIGNINENDED,
  };
};

export const signInError = error => {
  return {
    type: SIGNINERROR,
    error,
  };
};

export const loadAuthState = () => {
  return async dispatch => {
    const authState = await AsyncStorage.getItem(storageKey);
    dispatch(signIn(JSON.parse(authState)));
  };
};

export const verifyArtistAccount = (artistAccount: ArtistAccountModel) => {
  return async dispatch => {
    console.log('[AuthActions.tsx] verifyArtistAccount() => started');
    const response = await fetch(`${config.firebase.databaseURL}/artistAccount/${artistAccount.uid}.json`);
    const data: any = await response.json();

    if (data) {
      console.log('[AuthActions.tsx] verifyArtistAccount() => finished: user already registred');
      return;
    }
    console.log('[AuthActions.tsx] verifyArtistAccount() => finished: register user');
    dispatch(registerArtistAccount(artistAccount));
  };
};

const registerArtistAccount = (artistAccount: ArtistAccountModel) => {
  return async () => {
    console.log('[AuthActions.tsx] registerArtistAccount() => started');
    await fetch(`${config.firebase.databaseURL}/artistAccount/${artistAccount.uid}.json`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artistAccount),
    });
    console.log('[AuthActions.tsx] registerArtistAccount() => finished');
  };
};

export const signOut = () => {
  AsyncStorage.removeItem(storageKey);
  console.log('[AuthActions.tsx] signOut');
  return {
    type: SIGNOUT,
  };
};
