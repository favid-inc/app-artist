import { ArtistAccount } from './artistAccount.model';
export interface AuthState extends ArtistAccount {
  refreshToken?: string;
  accessToken?: string;
  expirationTime?: string;
  redirectEventId?: string;
}
