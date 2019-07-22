import { AsyncStorage } from 'react-native';
import { getArtist, storeArtist, putArtist } from './ArtistActions';
import { SIGNIN, SIGNOUT, SIGNINSTARTED, SIGNINENDED, SIGNINERROR } from './ActionTypes';
import * as config from '@src/core/config';
import { storageKeys } from '@src/core/config';
import { ArtistModel } from '@favid-inc/api';
import { AuthState as AuthStateModel } from '@src/core/model/authState.model';
import * as firebase from 'firebase';
import { Artist } from '@src/core/model';

const storageKey = storageKeys.currentUser;

export const auth = authResult => {
  return async dispatch => {
    dispatch(signInStarted());
    const credential = firebase.auth.GoogleAuthProvider.credential(authResult.idToken, authResult.accessToken);
    const authData = await firebase.auth().signInWithCredential(credential);
    const data = JSON.parse(JSON.stringify(authData)).user;
    const artist: ArtistModel = {
      id: data.uid,
      name: data.displayName,
      artisticName: data.displayName,
      photo: data.photoURL,
      email: data.email,
      about: '',
    };
    const authState: AuthStateModel = {
      ...data,
      redirectEventId: data.redirectEventId,
      lastLoginAt: data.lastLoginAt,
      createdAt: data.createdAt,
    };
    dispatch(verifyArtistAccount(artist, data.uid));
    await AsyncStorage.setItem(storageKey, JSON.stringify(authState));
    dispatch(signIn(authState));
    dispatch(signInFinished());
    dispatch(getArtist(data.uid));
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
    const artist = await AsyncStorage.getItem('artist');
    dispatch(signIn(JSON.parse(authState)));
    dispatch(storeArtist(JSON.parse(artist)));
  };
};

export const verifyArtistAccount = (artist: Artist, artistId: string) => {
  return async dispatch => {
    console.log('[AuthActions.tsx] verifyArtistAccount() => started');
    const response = await fetch(`${config.firebase.databaseURL}/artist/${artistId}.json`);
    const data: any = await response.json();

    if (data) {
      console.log('[AuthActions.tsx] verifyArtistAccount() => finished: user already registred');
      return;
    }
    console.log('[AuthActions.tsx] verifyArtistAccount() => finished: register user');
    dispatch(putArtist(artist, artistId));
  };
};

export const signOut = () => {
  AsyncStorage.removeItem(storageKey);
  console.log('[AuthActions.tsx] signOut');
  return {
    type: SIGNOUT,
  };
};
