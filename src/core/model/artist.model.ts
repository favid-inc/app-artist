import { ArtistModel as Artist } from '@favid-inc/api';
export { ArtistModel as Artist } from '@favid-inc/api';
export interface CategoryOfArtistModel {
  key: string;
  artists: Artist[];
}
