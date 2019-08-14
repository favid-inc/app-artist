import * as AppAuth from 'expo-app-auth';
import * as firebase from 'firebase';
import React from 'react';
import { AsyncStorage } from 'react-native';

export interface AuthState {
  accessToken: string;
  accessTokenExpirationDate: string;
  additionalParameters: object;
  idToken: string;
  refreshToken: string;
  tokenType: string;
}

interface AuthContext {
  isSignedIn: boolean;
  signIn: (props: AppAuth.OAuthProps) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext>({
  isSignedIn: false,
  signIn: () => null,
  signOut: () => null,
});

interface FirebaseAuthProps {
  children: React.ReactNode;
}

interface FirebaseAuthState extends AuthContext {
  oAuthProps: AppAuth.OAuthProps;
  tokens: AppAuth.TokenResponse;
}

export class FirebaseAuth extends React.Component<FirebaseAuthProps, FirebaseAuthState> {
  public state: FirebaseAuthState = {
    isSignedIn: false,
    oAuthProps: null,
    tokens: null,
    signIn: (props) => this.signIn(props),
    signOut: () => this.signOut(),
  };

  private storageKey = '@src:core:auth:FirebaseAuth';

  public render() {
    return <AuthContext.Provider value={this.state}>{this.props.children}</AuthContext.Provider>;
  }

  public async componentWillMount() {
    const { tokens, oAuthProps } = JSON.parse(await AsyncStorage.getItem(this.storageKey));

    this.setState({ tokens, oAuthProps });

    await this.handleAuthStateChanged();
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }

  private async signIn(oAuthProps: AppAuth.OAuthProps) {
    const tokens = await AppAuth.authAsync(oAuthProps);
    this.setState({ tokens, oAuthProps });
    await this.siginWithCredentials();
  }

  private async signOut() {
    this.setState({ oAuthProps: null, tokens: null, isSignedIn: false });
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.state));
    await AppAuth.revokeAsync(this.state.oAuthProps, {
      token: this.state.tokens.accessToken,
      isClientIdProvided: true,
    });
  }

  private handleAuthStateChanged = async () => {
    if (!this.state.tokens) {
      return;
    }

    if (Date.now() < new Date(this.state.tokens.accessTokenExpirationDate).getTime()) {
      const tokens = await AppAuth.refreshAsync(this.state.oAuthProps, this.state.tokens.refreshToken);
      this.setState({ tokens });
    }

    await this.siginWithCredentials();
  };

  private async siginWithCredentials() {
    try {
      const { oAuthProps, tokens } = this.state;
      const credential = getAuthProvider(oAuthProps).credential(tokens.idToken, tokens.accessToken);
      await firebase.auth().signInWithCredential(credential);
      await AsyncStorage.setItem(this.storageKey, JSON.stringify({ oAuthProps, tokens }));
      this.setState({ isSignedIn: true });
    } catch (e) {
      this.setState({ isSignedIn: false });
    }
  }
}

function getAuthProvider({ issuer }: AppAuth.OAuthProps) {
  switch (issuer) {
    case 'https://accounts.google.com':
      return firebase.auth.GoogleAuthProvider;
    default:
      throw new Error(`Unknown issuer: "${issuer}"`);
  }
}
