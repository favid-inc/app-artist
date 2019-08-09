export interface AuthState {
  accessToken: string;
  accessTokenExpirationDate: string;
  additionalParameters: object;
  idToken: string;
  refreshToken: string;
  tokenType: string;
}
