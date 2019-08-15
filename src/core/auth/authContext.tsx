import * as AppAuth from 'expo-app-auth';
import * as firebase from 'firebase';
import React from 'react';
import { AsyncStorage } from 'react-native';

interface AuthContext {
  isSigningIn: boolean;
  isSignedIn: boolean;
  signIn: (props: AppAuth.OAuthProps) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext>({
  isSigningIn: false,
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
    isSigningIn: false,
    isSignedIn: false,
    oAuthProps: null,
    tokens: null,
    signIn: (props) => this.signIn(props),
    signOut: () => this.signOut(),
  };

  private storageKey = '@app-artist:core:auth:FirebaseAuth';

  public render() {
    return (
      <AuthContext.Provider value={this.state}>
        <AuthContext.Consumer>{() => this.props.children}</AuthContext.Consumer>
      </AuthContext.Provider>
    );
  }

  public async componentWillMount() {
    const { tokens, oAuthProps } = JSON.parse((await AsyncStorage.getItem(this.storageKey)) || '{}');

    this.setState({ tokens, oAuthProps });

    await this.handleAuthStateChanged();
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
  }

  private async signIn(oAuthProps: AppAuth.OAuthProps) {
    try {
      this.setState({ isSigningIn: true });
      const tokens = await AppAuth.authAsync(oAuthProps);
      this.setState({ tokens, oAuthProps });
      await this.siginWithCredentials();
      this.setState({ isSignedIn: true });
    } catch (e) {
      this.setState({ isSignedIn: false });
    } finally {
      this.setState({ isSigningIn: false });
    }
  }

  private async signOut() {
    const { tokens, oAuthProps } = this.state;
    this.setState({ oAuthProps: null, tokens: null, isSignedIn: false });
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.state));
    await AppAuth.revokeAsync(oAuthProps, {
      token: tokens.accessToken,
      isClientIdProvided: true,
    });
  }

  private handleAuthStateChanged = async () => {
    if (!this.state.tokens) {
      return;
    }

    if (Date.now() < new Date(this.state.tokens.accessTokenExpirationDate).getTime()) {
      try {
        this.setState({ isSigningIn: true });
        const { refreshToken } = this.state.tokens;
        const tokens = await AppAuth.refreshAsync(this.state.oAuthProps, refreshToken);
        this.setState({ tokens: { ...tokens, refreshToken } });
        await this.siginWithCredentials();
        this.setState({ isSignedIn: true });
      } catch (e) {
        this.setState({ isSignedIn: false });
      } finally {
        this.setState({ isSigningIn: false });
      }
    }
  };

  private async siginWithCredentials() {
    const { oAuthProps, tokens } = this.state;
    const credential = getAuthProvider(oAuthProps).credential(tokens.idToken, tokens.accessToken);
    await firebase.auth().signInWithCredential(credential);
    await AsyncStorage.setItem(this.storageKey, JSON.stringify({ oAuthProps, tokens }));
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
