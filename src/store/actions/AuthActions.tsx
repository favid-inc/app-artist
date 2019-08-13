import { AsyncStorage } from 'react-native';
import * as AppAuth from 'expo-app-auth';
import { getArtist, putArtist } from './ArtistActions';
import { SIGN_IN, SIGN_OUT, SIGN_IN_STARTED, SIGN_IN_ENDED, SIGN_IN_ERROR } from './ActionTypes';
import * as config from '@src/core/config';
import { storageKeys } from '@src/core/config';
import { Artist } from '@favid-inc/api';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';
import * as firebase from 'firebase';

const storageKey = storageKeys.currentUser;

export const auth = () => {
  return async dispatch => {
    dispatch(signInStarted());

    const authState = await AppAuth.authAsync(config.auth);

    const credential = firebase.auth.GoogleAuthProvider.credential(authState.idToken, authState.accessToken);
    await firebase.auth().signInWithCredential(credential);
    const { uid, displayName, photoURL, email } = await firebase.auth().currentUser;

    const artist: Artist = {
      id: uid,
      name: displayName,
      photo: photoURL,
      email,
    };

    dispatch(verifyArtistAccount(artist, uid));
    await AsyncStorage.setItem(storageKey, JSON.stringify({ authState }));
    dispatch(signIn(authState, artist));
    dispatch(signInFinished());
    dispatch(getArtist(uid));
  };
};

export const reAuth = ({ refreshToken }: AuthStateModel) => {
  return async dispatch => {
    const authState = await AppAuth.refreshAsync(config.auth, refreshToken);
    const credential = firebase.auth.GoogleAuthProvider.credential(authState.idToken, authState.accessToken);
    await firebase.auth().signInWithCredential(credential);

    const { uid, displayName, photoURL, email } = await firebase.auth().currentUser;
    const artist: Artist = { id: uid, name: displayName, photo: photoURL, email };

    await AsyncStorage.setItem(storageKey, JSON.stringify({ authState, artist }));
    dispatch(signIn(authState, artist));
  };
};

export const verifySession = (authState: AuthStateModel) => {
  return async dispatch => {
    const expirationTime = new Date(authState.accessTokenExpirationDate).getTime();
    const currentTime = new Date().getTime();

    console.log('[AuthActions.tsx] veridySession(): expirationTime: ', new Date(expirationTime).toString());
    console.log('[AuthActions.tsx] veridySession(): currentTime: ', new Date(currentTime).toString());

    if (expirationTime < currentTime) {
      dispatch(reAuth(authState));
      console.log('[AuthActions.tsx] verifySession() session expirated');
    } else {
      console.log('[AuthActions.tsx] veridySession() user authenticated');
    }
  };
};

export const signIn = (authState: AuthStateModel, artist: Artist) => {
  return {
    type: SIGN_IN,
    authState,
    artist,
  };
};

export const signInStarted = () => {
  return {
    type: SIGN_IN_STARTED,
  };
};

export const signInFinished = () => {
  return {
    type: SIGN_IN_ENDED,
  };
};

export const signInError = error => {
  return {
    type: SIGN_IN_ERROR,
    error,
  };
};

export const loadAuthState = () => {
  return async dispatch => {
    const data = await AsyncStorage.getItem(storageKey);
    if (!data) {
      return;
    }
    const { authState, artist } = JSON.parse(data);
    dispatch(signIn(authState, artist));
  };
};

export const verifyArtistAccount = (artist: Artist, artistId: string) => {
  return async dispatch => {
    // console.log('[AuthActions.tsx] verifyArtistAccount() => started');
    const response = await fetch(`${config.firebase.databaseURL}/artist/${artistId}.json`);
    const data: any = await response.json();

    if (data) {
      // console.log('[AuthActions.tsx] verifyArtistAccount() => finished: user already registred');
      return;
    }
    // console.log('[AuthActions.tsx] verifyArtistAccount() => finished: register user');
    dispatch(putArtist(artist, artistId));
  };
};

export const removeUser = () => {
  return {
    type: SIGN_OUT,
  };
};

export const signOut = () => {
  return async dispatch => {
    await firebase.auth().signOut();
    await AsyncStorage.removeItem(storageKey);
    dispatch(removeUser());
  };
};
