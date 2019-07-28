import { STORE_ARTIST, REMOVE_ARTIST, STORE_ARTISTS, ARTIST_STARTED_LOADING, ARTIST_ENDED_LOADING } from '../actions/ActionTypes';

const INITIAL_STATE = {
  artist: null,
  categoryOfArtists: null,
  loading: false,
};

const storeArtist = (state, action) => {
  // console.log('[ArtistReducer.tsx] storeArtist() called: ' + action.payload.id);
  return {
    ...state,
    artist: {
      ...state.artist,
      ...action.payload,
    },
  };
};

const storeArtists = (state, action) => {
  // console.log('[ArtistReducer.tsx] storeArtists() called: ' + action.payload);
  return {
    ...state,
    categoryOfArtists: [...action.payload],
  };
};

const removeArtist = state => {
  return {
    ...state,
    artist: null,
  };
};

const startedLoading = state => {
  return {
    ...state,
    loading: true,
  };
};

const endedLoading = state => {
  return {
    ...state,
    loading: false,
  };
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STORE_ARTIST:
      return storeArtist(state, action);
    case REMOVE_ARTIST:
      return removeArtist(state);
    case STORE_ARTISTS:
      return storeArtists(state, action);
    case ARTIST_STARTED_LOADING:
      return startedLoading(state);
    case ARTIST_ENDED_LOADING:
      return endedLoading(state);
    default:
      return state;
  }
};

export default authReducer;
