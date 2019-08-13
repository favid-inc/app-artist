import { Artist } from '@favid-inc/api';
export { Artist };
export interface CategoryOfArtistModel {
  key: string;
  artists: Artist[];
}
