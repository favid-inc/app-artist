import { STOREARTIST, REMOVEARTIST, STOREARTISTS } from '../actions/ActionTypes';

const INITIAL_STATE = {
  artist: null,
  categoryOfArtists: null,
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

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STOREARTIST:
      return storeArtist(state, action);
    case REMOVEARTIST:
      return removeArtist(state);
    case STOREARTISTS:
      return storeArtists(state, action);
    default:
      return state;
  }
};

export default authReducer;
