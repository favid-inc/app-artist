import { AsyncStorage } from 'react-native';
import {
  REMOVE_ARTIST,
  STORE_ARTIST,
  STORE_ARTISTS,
  ARTIST_ERROR,
  ARTIST_STARTED_LOADING,
  ARTIST_ENDED_LOADING,
} from './ActionTypes';
import * as config from '@src/core/config';
import { ArtistSearchByMainCategoryResult, ArtistModel, ArtistSearch, ARTIST, ARTIST_CATEGORY } from '@favid-inc/api';
import { Artist, CategoryOfArtistModel } from '@src/core/model';

export const setArtist = (artist: Artist) => {
  return async dispatch => {
    await AsyncStorage.setItem(ARTIST, JSON.stringify(artist));
    dispatch(storeArtist(artist));
  };
};

export const loadArtist = () => {
  return async dispatch => {
    const artist = await AsyncStorage.getItem(ARTIST);
    dispatch(storeArtist(JSON.parse(artist)));
  };
};

export const getArtist = (artistId: string) => {
  return async dispatch => {
    const response = await fetch(`${config.firebase.databaseURL}/${ARTIST}/${artistId}.json`);
    const artist: ArtistModel = await response.json();
    dispatch(setArtist(artist));
  };
};

const processArtistList = (result: ArtistSearchByMainCategoryResult): CategoryOfArtistModel[] => {
  const categoryOfArtists: CategoryOfArtistModel[] = result.aggregations.mainCategory.buckets.map(bucket => {
    const artists: Artist[] = bucket.by_top_hit.hits.hits.map(a => a._source);

    const category: CategoryOfArtistModel = {
      key: bucket.key,
      artists,
    };

    return category;
  });
  return categoryOfArtists;
};

export const listArtists = () => {
  return async dispatch => {
    const storeArtists = await AsyncStorage.getItem(ARTIST_CATEGORY);
    if (storeArtists) {
      dispatch({
        type: STORE_ARTISTS,
        payload: JSON.parse(storeArtists),
      });
    }

    const response = await fetch(`${config.api.baseURL}/${ArtistSearch.BY_MAIN_CATEGORY}`);
    const data: ArtistSearchByMainCategoryResult = await response.json();
    const categoryOfArtists: CategoryOfArtistModel[] = processArtistList(data);
    AsyncStorage.setItem(ARTIST_CATEGORY, JSON.stringify(categoryOfArtists));
    dispatch({
      type: STORE_ARTISTS,
      payload: categoryOfArtists,
    });
  };
};

export const storeArtist = (artist: Artist) => {
  return {
    type: STORE_ARTIST,
    payload: artist,
  };
};

export const removeArtist = () => {
  AsyncStorage.removeItem(ARTIST);
  return {
    type: REMOVE_ARTIST,
  };
};

export const startLoading = () => ({
  type: ARTIST_STARTED_LOADING,
});

export const stopLoading = () => ({
  type: ARTIST_ENDED_LOADING,
});

export const artistError = error => ({
  type: ARTIST_ERROR,
  error,
});

export const putArtist = (artist: Artist, artistId: string) => {
  return async dispatch => {
    try {
      dispatch(startLoading());
      const response = await fetch(`${config.firebase.databaseURL}/${ARTIST}/${artistId}.json`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
      });

      if (!response.ok) {
        throw Error('Erro ao salvar dados');
      }

      dispatch(setArtist(artist));
      dispatch(stopLoading());
    } catch (error) {
      dispatch(artistError({ message: 'Não foi possível salvar os dados.' }));
      dispatch(stopLoading());
    }
  };
};
