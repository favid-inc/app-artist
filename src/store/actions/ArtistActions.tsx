import { AsyncStorage } from 'react-native';
import { REMOVEARTIST, STOREARTIST, STOREARTISTS, ARTISTSTARTEDLOADING, ARTISTENDEDLOADING } from './ActionTypes';
import * as config from '@src/core/config';
import { ArtistSearchByMainCategoryResult, ARTIST_SEARCH_BY_MAIN_CATEGORY, ArtistModel } from '@favid-inc/api';
import { Artist, CategoryOfArtistModel } from '@src/core/model';

export const setArtist = (artist: Artist) => {
  AsyncStorage.setItem('artist', JSON.stringify(artist));
  return async dispatch => dispatch(storeArtist(artist));
};

export const getArtist = (artistId: string) => {
  return async dispatch => {
    const response = await fetch(`${config.firebase.databaseURL}/artist/${artistId}.json`);
    const artist: ArtistModel = await response.json();

    console.log('[ArtistActions.tsx] getArtist() => artist: ', artist);
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
    const storeArtists = await AsyncStorage.getItem('categoryOfArtists');
    if (storeArtists) {
      dispatch({
        type: STOREARTISTS,
        payload: JSON.parse(storeArtists),
      });
    }

    const response = await fetch(`${config.api.baseURL}/${ARTIST_SEARCH_BY_MAIN_CATEGORY}`);
    const data: ArtistSearchByMainCategoryResult = await response.json();
    const categoryOfArtists: CategoryOfArtistModel[] = processArtistList(data);
    AsyncStorage.setItem('categoryOfArtists', JSON.stringify(categoryOfArtists));
    dispatch({
      type: STOREARTISTS,
      payload: categoryOfArtists,
    });
  };
};

export const storeArtist = (artist: Artist) => {
  return {
    type: STOREARTIST,
    payload: artist,
  };
};

export const removeArtist = () => {
  AsyncStorage.removeItem('artist');
  return {
    type: REMOVEARTIST,
  };
};

export const artistStartedLoading = () => ({
  type: ARTISTSTARTEDLOADING,
});

export const artistEndedLoading = () => ({
  type: ARTISTENDEDLOADING,
});

export const putArtist = (artist: Artist, artistId: string) => {
  return async dispatch => {
    dispatch(artistStartedLoading());
    await fetch(`${config.firebase.databaseURL}/artist/${artistId}.json`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(artist),
    });
    dispatch(setArtist(artist));
    dispatch(artistEndedLoading());
  };
};
